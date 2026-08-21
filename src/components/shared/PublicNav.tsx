import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'

const NAV_LINKS: { to: string; labelKey: string }[] = [
  { to: '/', labelKey: 'HOME' },
  { to: '/menu', labelKey: 'NAV_CATALOG' },
  { to: '/about', labelKey: 'NAV_ABOUT' },
  { to: '/contact', labelKey: 'NAV_CONTACT' },
]

interface IPublicNav {
  storeName?: string
  storeLogo?: string
}

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS

export const PublicNav = ({ storeName, storeLogo }: IPublicNav) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { device } = useWeb()
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setHidden(currentY > lastScrollY.current && currentY > 80)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: device === 'mobile' ? '12px 16px' : '16px 40px',
        background: theme.background.secondary,
        boxShadow: theme.shadow.secondary,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: '0.3s ease',
      }}
    >
      <Link
        to='/'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: theme.text.primary,
          fontSize: 18,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        {storeLogo && (
          <img
            src={`${IMAGE_HOST}${storeLogo}`}
            alt={storeName || language['HOME']}
            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }}
          />
        )}
        {storeName || language['HOME']}
      </Link>
      <div style={{ display: 'flex', gap: device === 'mobile' ? 12 : 24, alignItems: 'center' }}>
        {NAV_LINKS.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                color: active ? theme.color.info : theme.text.secondary,
                fontSize: device === 'mobile' ? 12 : 14,
                textDecoration: 'none',
                fontWeight: active ? 600 : 400,
              }}
            >
              {language[item.labelKey]}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
