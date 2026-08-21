import { useEffect, useState } from 'react'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { IPublicAnnouncement } from 'api/menu.api'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { IconButton } from '@mui/material'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS
const AUTO_ADVANCE_MS = 5000

interface IAnnouncementCarousel {
  announcements: IPublicAnnouncement[]
  height?: string
  borderRadius?: number
}

export const AnnouncementCarousel = ({ announcements, height = 'min(60vh, 420px)', borderRadius = 0 }: IAnnouncementCarousel) => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [announcements])

  useEffect(() => {
    if (announcements.length < 2) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [announcements.length])

  if (announcements.length === 0) return null

  const localize = (name?: Record<string, string>) => name?.[lang] || name?.['English'] || ''

  const goTo = (next: number) => {
    setIndex((next + announcements.length) % announcements.length)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius,
        background: theme.background.tertiary,
      }}
    >
      {announcements.map((announcement, i) => (
        <div
          key={announcement._id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.6s ease',
            pointerEvents: i === index ? 'auto' : 'none',
          }}
        >
          {announcement.banner?.filename && (
            <img
              src={`${IMAGE_HOST}${announcement.banner.filename}`}
              alt={localize(announcement.title)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              boxSizing: 'border-box',
              padding: '32px 40px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
              color: '#ffffff',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>{localize(announcement.title)}</div>
            {announcement.description && (
              <div style={{ fontSize: 14, opacity: 0.9, maxWidth: 560 }}>{localize(announcement.description)}</div>
            )}
          </div>
        </div>
      ))}

      {announcements.length > 1 && (
        <>
          <IconButton
            onClick={() => goTo(index - 1)}
            style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', color: '#ffffff', background: 'rgba(0,0,0,0.3)' }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => goTo(index + 1)}
            style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', color: '#ffffff', background: 'rgba(0,0,0,0.3)' }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8,
            }}
          >
            {announcements.map((announcement, i) => (
              <div
                key={announcement._id}
                onClick={() => goTo(i)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: i === index ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
