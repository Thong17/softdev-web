import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { CircularProgress, IconButton, Tooltip } from '@mui/material'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'

export interface ILocation {
  lat: number
  lng: number
  label?: string
}

// Leaflet looks for its marker images next to its CSS, which the bundler
// moves; point it at the bundled files instead
const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
})

// Used when the device location is unavailable (denied, not on HTTPS) or
// outside Cambodia
const FALLBACK: ILocation = { lat: 11.5564, lng: 104.9282 } // Phnom Penh

// The map starts in Cambodia: a desktop without GPS guesses its location from
// the internet connection, which a VPN can place in another country, so a
// device location outside Cambodia is ignored
const CAMBODIA = { south: 9.9, north: 14.75, west: 102.3, east: 107.7 }
export const inCambodia = (location?: ILocation | null) => !!location
  && location.lat >= CAMBODIA.south && location.lat <= CAMBODIA.north
  && location.lng >= CAMBODIA.west && location.lng <= CAMBODIA.east

class OutsideCambodiaError extends Error {}

const round = (value: number) => Math.round(value * 1e6) / 1e6

const getDeviceLocation = () => new Promise<ILocation>((resolve, reject) => {
  if (!navigator.geolocation) return reject(new Error('Location is not supported on this device'))
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const location = { lat: round(position.coords.latitude), lng: round(position.coords.longitude) }
      if (!inCambodia(location)) return reject(new OutsideCambodiaError('outside'))
      resolve(location)
    },
    (err) => reject(err),
    { enableHighAccuracy: true, timeout: 10000 },
  )
})

export interface IPlace extends ILocation {
  label: string
}

// OpenStreetMap place search (Nominatim). Its usage policy allows light use
// only, so it runs on Enter rather than on every keystroke. Plain fetch, so
// none of the app's API headers go to the outside service.
const searchPlaces = async (query: string, near: ILocation, lang: string): Promise<IPlace[]> => {
  const request = async (countrycodes?: string) => {
    const params = new URLSearchParams({
      q: query,
      format: 'jsonv2',
      limit: '6',
      addressdetails: '0',
      'accept-language': lang,
      // Results near the current pin first
      viewbox: `${near.lng - 0.6},${near.lat + 0.6},${near.lng + 0.6},${near.lat - 0.6}`,
      ...(countrycodes && { countrycodes }),
    })
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error('Search failed')
    const results = await response.json()
    return (results || []).map((item) => ({ lat: round(Number(item.lat)), lng: round(Number(item.lon)), label: item.display_name }))
  }
  // Cambodia first; other countries only when nothing in Cambodia matches
  const local = await request('kh')
  return local.length ? local : request()
}

// Clicking the map moves the pin there
const ClickToPick = ({ onPick }) => {
  useMapEvents({
    click: (event) => onPick({ lat: round(event.latlng.lat), lng: round(event.latlng.lng) }),
  })
  return null
}

// Keeps the view on the pin when it moves from outside the map
const FollowPin = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], Math.max(map.getZoom(), 15))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position?.lat, position?.lng])
  return null
}

// Map with a draggable pin. With no value it starts at the device's location
// and reports it through `onDefault`, so a new customer gets it without a click.
export const MapPicker = ({
  value,
  onChange,
  onDefault,
  onPlace,
  label = 'Location',
  height = 220,
  disabled = false,
}: {
  value?: ILocation | null
  onChange: (location: ILocation) => void
  onDefault?: (location: ILocation) => void
  // Called with the chosen search result, e.g. to fill an empty address
  onPlace?: (place: IPlace) => void
  label?: string
  height?: number
  disabled?: boolean
}) => {
  const { theme } = useTheme()
  const { lang: appLanguage } = useLanguage()
  const [locating, setLocating] = useState(false)
  const [message, setMessage] = useState('')
  const [center, setCenter] = useState<ILocation>(inCambodia(value) ? (value as ILocation) : FALLBACK)
  const markerRef = useRef<L.Marker>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<IPlace[] | null>(null)
  const [searching, setSearching] = useState(false)

  const locationError = (err) => err instanceof OutsideCambodiaError
    ? 'This device\'s location is outside Cambodia, so the map starts in Phnom Penh. Search or tap the map to place the pin.'
    : null

  useEffect(() => {
    if (value) {
      return
    }
    setLocating(true)
    getDeviceLocation()
      .then((location) => {
        setCenter(location)
        onDefault?.(location)
        setMessage('')
      })
      .catch((err) => setMessage(locationError(err) || 'Could not get this device\'s location; tap the map to place the pin'))
      .finally(() => setLocating(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useMyLocation = () => {
    setLocating(true)
    getDeviceLocation()
      .then((location) => {
        onChange(location)
        setMessage('')
      })
      .catch((err) => setMessage(locationError(err) || 'Could not get this device\'s location; allow location access or tap the map'))
      .finally(() => setLocating(false))
  }

  const runSearch = () => {
    const text = query.trim()
    if (text.length < 2 || searching) return
    setSearching(true)
    setResults(null)
    // Results in the app's language (English place names fall back to Khmer)
    const lang = appLanguage === 'Khmer' ? 'km,en' : 'en,km'
    searchPlaces(text, value || center, lang)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setSearching(false))
  }

  const pickPlace = (place: IPlace) => {
    setResults(null)
    setQuery(place.label.split(',')[0])
    onChange({ lat: place.lat, lng: place.lng })
    onPlace?.(place)
  }

  const dragEvents = useMemo(() => ({
    dragend: () => {
      const latlng = markerRef.current?.getLatLng()
      if (latlng) onChange({ lat: round(latlng.lat), lng: round(latlng.lng) })
    },
  }), [onChange])

  const position = value || center

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: theme.text.secondary, fontSize: 13 }}>
        <span>{label}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.text.tertiary, fontSize: 12 }}>
          {value ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : '--'}
          {!disabled && (
            <Tooltip title='Use my location'>
              <span>
                <IconButton size='small' onClick={useMyLocation} disabled={locating} style={{ color: theme.color.info, width: 26, height: 26 }}>
                  {locating ? <CircularProgress size={14} /> : <MyLocationRoundedIcon style={{ fontSize: 18 }} />}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </span>
      </div>
      <div style={{ height, borderRadius: theme.radius.secondary, overflow: 'hidden', border: theme.border.quaternary, position: 'relative', zIndex: 0 }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={value ? 16 : 14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {!disabled && <ClickToPick onPick={onChange} />}
          <FollowPin position={position} />
          <Marker position={[position.lat, position.lng]} icon={pinIcon} draggable={!disabled} eventHandlers={dragEvents} ref={markerRef as any} />
        </MapContainer>
          {!disabled && (
          // Floats over the map's top-right corner (zoom buttons are top left).
          // It sits outside MapContainer, so typing or clicking here never
          // moves the pin.
          <div style={{ position: 'absolute', top: 10, right: 10, width: 'min(300px, calc(100% - 64px))', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.background.primary, border: theme.border.quaternary, borderRadius: theme.radius.primary, boxShadow: theme.shadow.secondary, padding: '0 2px 0 10px', height: 32 }}>
              <input
                type='search'
                data-unsaved-ignore
                value={query}
                placeholder='Search place, press Enter'
                onChange={(event) => {
                  setQuery(event.target.value)
                  if (!event.target.value) setResults(null)
                }}
                onKeyDown={(event) => {
                  // Enter searches; it must not submit the surrounding form
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    runSearch()
                  }
                  if (event.key === 'Escape') setResults(null)
                }}
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: theme.text.primary, fontFamily: 'inherit', fontSize: 13 }}
              />
              <IconButton size='small' onClick={runSearch} disabled={searching} style={{ color: theme.text.secondary, width: 28, height: 28 }}>
                {searching ? <CircularProgress size={14} /> : <SearchRoundedIcon style={{ fontSize: 18 }} />}
              </IconButton>
            </div>
            {results && (
              <div
                style={{
                  position: 'absolute',
                  top: 36,
                  left: 0,
                  right: 0,
                  // Stays inside the map
                  maxHeight: Math.max(height - 60, 80),
                  overflowY: 'auto',
                  backgroundColor: theme.background.primary,
                  border: theme.border.quaternary,
                  borderRadius: theme.radius.primary,
                  boxShadow: theme.shadow.secondary,
                }}
              >
                {results.length === 0 && (
                  <div style={{ padding: '8px 12px', fontSize: 13, color: theme.text.tertiary }}>No places found. Try a different name, or tap the map.</div>
                )}
                {results.map((place, index) => (
                  <div
                    key={`${place.lat},${place.lng},${index}`}
                    role='button'
                    onClick={() => pickPlace(place)}
                    style={{ padding: '8px 12px', fontSize: 13, color: theme.text.secondary, cursor: 'pointer', borderTop: index ? theme.border.quaternary : 'none' }}
                    onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = `${theme.text.secondary}11` }}
                    onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    {place.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {message && <span style={{ color: theme.color.warning || theme.text.tertiary, fontSize: 12 }}>{message}</span>}
    </div>
  )
}

// Opens the location in the device's maps app / Google Maps
export const mapLink = (location?: ILocation | null) =>
  location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : undefined
