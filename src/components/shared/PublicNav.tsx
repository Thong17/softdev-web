import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import { themeMode } from 'contexts/theme/constant'
import { languages } from 'contexts/language/constant'
import { ThemeOptions } from 'contexts/theme/interface'
import { LanguageOptions } from 'contexts/language/interface'
import { IconButton, Menu, MenuItem, ListItemText } from '@mui/material'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

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
  const [themeAnchor, setThemeAnchor] = useState<Element | null>(null)
  const [langAnchor, setLangAnchor] = useState<Element | null>(null)

  const handleSelectTheme = (option: string) => {
    changeTheme(option as ThemeOptions)
    setThemeAnchor(null)
  }

  const handleSelectLanguage = (option: string) => {
    changeLanguage(option as LanguageOptions)
    setLangAnchor(null)
  }

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

        <IconButton
          size='small'
          onClick={(event) => setThemeAnchor(event.currentTarget)}
          style={{ color: theme.text.secondary }}
          aria-label='change theme'
        >
          <PaletteRoundedIcon fontSize='small' />
        </IconButton>
        <Menu
          open={Boolean(themeAnchor)}
          anchorEl={themeAnchor}
          onClose={() => setThemeAnchor(null)}
          PaperProps={{ sx: { backgroundColor: theme.background.secondary, borderRadius: theme.radius.quaternary } }}
        >
          {Object.keys(themeMode).map((option) => (
            <MenuItem
              key={option}
              selected={option === mode}
              onClick={() => handleSelectTheme(option)}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, minWidth: 120 }}
            >
              <ListItemText sx={{ color: theme.text.primary }}>{option}</ListItemText>
              {option === mode && <CheckRoundedIcon fontSize='small' sx={{ color: theme.color.info }} />}
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          size='small'
          onClick={(event) => setLangAnchor(event.currentTarget)}
          style={{ color: theme.text.secondary }}
          aria-label='change language'
        >
          <TranslateRoundedIcon fontSize='small' />
        </IconButton>
        <Menu
          open={Boolean(langAnchor)}
          anchorEl={langAnchor}
          onClose={() => setLangAnchor(null)}
          PaperProps={{ sx: { backgroundColor: theme.background.secondary, borderRadius: theme.radius.quaternary } }}
        >
          {Object.keys(languages).map((option) => (
            <MenuItem
              key={option}
              selected={option === lang}
              onClick={() => handleSelectLanguage(option)}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, minWidth: 120 }}
            >
              <ListItemText sx={{ color: theme.text.primary }}>{option}</ListItemText>
              {option === lang && <CheckRoundedIcon fontSize='small' sx={{ color: theme.color.info }} />}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  )
}
