import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import { themeMode } from 'contexts/theme/constant'
import { languages } from 'contexts/language/constant'
import { ThemeOptions } from 'contexts/theme/interface'
import { LanguageOptions } from 'contexts/language/interface'
import { IconDropdown } from 'components/shared/IconDropdown'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'

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
  const { theme, mode, changeTheme } = useTheme()
  const { lang, language, changeLanguage } = useLanguage()
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
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
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
          justifySelf: 'start',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: theme.text.primary,
          fontSize: 18,
          textDecoration: 'none',
        }}
      >
        {storeLogo && (
          <img
            src={`${IMAGE_HOST}${storeLogo}`}
            alt={storeName || language['HOME']}
            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '10px' }}
          />
        )}
        {storeName || language['HOME']}
      </Link>
      <div style={{ justifySelf: 'center', display: 'flex', gap: device === 'mobile' ? 12 : 24, alignItems: 'center' }}>
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
                whiteSpace: 'nowrap',
              }}
            >
              {language[item.labelKey]}
            </Link>
          )
        })}
      </div>
      <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 20 }}>
        <IconDropdown
          icon={<PaletteRoundedIcon fontSize='small' />}
          value={mode}
          options={Object.keys(themeMode).map((option) => ({ value: option, label: option }))}
          onChange={(option) => changeTheme(option as ThemeOptions)}
          ariaLabel='change theme'
        />
        <IconDropdown
          icon={<TranslateRoundedIcon fontSize='small' />}
          value={lang}
          options={Object.keys(languages).map((option) => ({ value: option, label: option }))}
          onChange={(option) => changeLanguage(option as LanguageOptions)}
          ariaLabel='change language'
        />
      </div>
    </div>
  )
}
