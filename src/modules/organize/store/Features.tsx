import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Switch } from '@mui/material'
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded'
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded'
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import Container from 'components/shared/Container'
import Breadcrumb from 'components/shared/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { HintBox } from 'components/shared/HintBox'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { IStoreFeatures, refreshStoreFeatures, StoreFeature } from 'hooks/useStoreFeatures'
import { storeStages } from './stages'

const allOn: IStoreFeatures = { labelPrinting: true, tables: true, reservation: true, queue: true }

const featureList: { key: StoreFeature, title: string, detail: string, icon: ReactNode }[] = [
  { key: 'labelPrinting', title: 'Label printing', detail: 'Print Label buttons at checkout, the label print icon on items, the category "Thermal printing" option and the label printer setting.', icon: <LocalPrintshopRoundedIcon /> },
  { key: 'tables', title: 'Tables & layout', detail: 'Table picker in the cashing cart, and floors, rooms and tables on the Store page.', icon: <TableBarRoundedIcon /> },
  { key: 'reservation', title: 'Reservation', detail: 'Operation › Reservation. It books tables, so it turns off with Tables.', icon: <EventSeatRoundedIcon /> },
  { key: 'queue', title: 'Queue', detail: '"Add to queue" after checkout and Function › Queue.', icon: <ConfirmationNumberRoundedIcon /> },
]

// Store › Features: switch off parts of the app the store doesn't use. Off
// only hides them; their data stays and comes back when switched on again.
export const FeatureStore = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const [value, setValue] = useState<IStoreFeatures>(allOn)
  const [saved, setSaved] = useState<IStoreFeatures>(allOn)
  const [saving, setSaving] = useState(false)
  const isDirty = JSON.stringify(value) !== JSON.stringify(saved)
  const { markSaved, trackChanges } = useUnsavedChanges({ isDirty })

  useEffect(() => {
    Axios({ method: 'GET', url: '/shared/store/features' })
      .then((response) => {
        const loaded = { ...allOn, ...(response?.data?.data || {}) }
        setValue(loaded)
        setSaved(loaded)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = (key: StoreFeature) => setValue((prev) => {
    const next = { ...prev, [key]: !prev[key] }
    // Reservation needs tables
    if (key === 'tables' && !next.tables) next.reservation = false
    if (key === 'reservation' && next.reservation) next.tables = true
    return next
  })

  const handleSave = () => {
    setSaving(true)
    Axios({ method: 'PUT', url: '/organize/store/feature-setting', body: value })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        setSaved(value)
        markSaved()
        // Menus and screens update straight away
        refreshStoreFeatures()
      })
      .catch((err) => notify(err?.response?.data?.msg || 'Could not save', 'error'))
      .finally(() => setSaving(false))
  }

  return (
    <Container header={<Breadcrumb stages={storeStages(language, id, 'features')} title={<StorefrontRoundedIcon />} />}>
      <div {...trackChanges} style={{ display: 'flex', flexDirection: 'column', gap: 15, paddingTop: 20, paddingBottom: 20 }}>
        <HintBox>
          Turn off what this store doesn't use, e.g. a stationery shop has no tables or reservations. Turning a feature off only hides it for everyone; its data is kept and comes back when you turn it on again.
        </HintBox>
        {featureList.map((feature) => {
          const on = value[feature.key]
          return (
            <label
              key={feature.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 15,
                padding: '14px 16px',
                borderRadius: theme.radius.secondary,
                border: on ? `1px solid ${theme.color.info}66` : theme.border.quaternary,
                backgroundColor: on ? `${theme.color.info}0d` : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'flex', color: on ? theme.color.info : theme.text.tertiary }}>{feature.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', color: theme.text.primary, fontSize: 15 }}>{feature.title}</span>
                <span style={{ display: 'block', color: theme.text.tertiary, fontSize: 13 }}>{feature.detail}</span>
              </span>
              <Switch
                checked={on}
                onChange={() => toggle(feature.key)}
                inputProps={{ 'aria-label': feature.title }}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: theme.color.info },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.color.info, opacity: 0.5 },
                  '& .MuiSwitch-track': { backgroundColor: theme.text.tertiary },
                }}
              />
            </label>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            variant='contained'
            disabled={saving || !isDirty}
            onClick={handleSave}
            style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info, opacity: saving || !isDirty ? 0.6 : 1 }}
          >
            {language['SAVE']}
          </Button>
        </div>
      </div>
    </Container>
  )
}
