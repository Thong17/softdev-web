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
import { IconButton, Tooltip } from '@mui/material'
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'

const NAV_LINKS: { to: string; labelKey: string }[] = [
  { to: '/', labelKey: 'HOME' },
  { to: '/menu', labelKey: 'NAV_CATALOG' },
  { to: '/about', labelKey: 'NAV_ABOUT' },
  { to: '/contact', labelKey: 'NAV_CONTACT' },
]

interface IPublicNav {
  storeName?: string
  storeLogo?: string
  storeAddress?: string
}

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS

export const PublicNav = ({ storeName, storeLogo, storeAddress }: IPublicNav) => {
  const { theme, mode, changeTheme } = useTheme()
  const { lang, language, changeLanguage } = useLanguage()
  const { device } = useWeb()
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setHidden(currentY > lastScrollY.current && currentY > 80)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [location])

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setNavOpen(false)
    }
    if (navOpen) document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [navOpen])

  const isMobile = device === 'mobile'

  return (
    <div
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto 1fr',
        alignItems: 'center',
        padding: isMobile ? '12px 16px' : '16px 40px',
        background: theme.background.secondary,
        boxShadow: theme.shadow.secondary,
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: '0.3s ease',
      }}
    >
      <Link
        to='/'
        style={{
          justifySelf: isMobile ? 'stretch' : 'start',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: theme.text.primary,
          fontSize: 18,
          textDecoration: 'none',
          minWidth: 0,
        }}
      >
        {storeLogo && (
          <img
            src={`${IMAGE_HOST}${storeLogo}`}
            alt={storeName || language['HOME']}
            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {storeName || language['HOME']}
          </span>
          {storeAddress && (
            <Tooltip title={storeAddress}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  maxWidth: 250,
                  fontSize: 11,
                  fontWeight: 400,
                  color: theme.text.tertiary,
                  minWidth: 0,
                }}
              >
                <PlaceRoundedIcon style={{ fontSize: 12, flexShrink: 0 }} />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}
                >
                  {storeAddress}
                </span>
              </span>
            </Tooltip>
          )}
        </div>
      </Link>

      {!isMobile && (
        <div style={{ justifySelf: 'center', display: 'flex', gap: 24, alignItems: 'center' }}>
          {NAV_LINKS.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  color: active ? theme.color.info : theme.text.secondary,
                  fontSize: 14,
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
      )}

      <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 20 }}>
        {isMobile && (
          <IconButton
            size='small'
            onClick={() => setNavOpen((open) => !open)}
            style={{ color: theme.text.secondary }}
            aria-label='toggle menu'
          >
            <MenuRoundedIcon fontSize='small' />
          </IconButton>
        )}
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

      {isMobile && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: navOpen ? 300 : 0,
            background: theme.background.secondary,
            boxShadow: navOpen ? theme.shadow.bottom : 'none',
            transition: '0.3s ease',
          }}
        >
          {NAV_LINKS.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  padding: '13px 16px',
                  textAlign: 'center',
                  color: active ? theme.color.info : theme.text.secondary,
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  textDecoration: 'none',
                }}
              >
                {language[item.labelKey]}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
