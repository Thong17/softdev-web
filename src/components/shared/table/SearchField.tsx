import useTheme from 'hooks/useTheme'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey'
import { MenuDialog } from '../MenuDialog'
import { CustomSearchField, CustomMiniSearchField } from 'styles'
import { IconButton, MenuItem } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'

export const SearchField = ({ ...props }) => {
  const searchField = useRef(document.createElement('input'))
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }

  useEffect(() => {
    if (!active) return
    searchField.current.focus()
  }, [active])

  return (
    <CustomSearchField styled={theme} device={device} active={active ? 'active' : 'inactive'}>
      <div style={{ display: active ? 'flex' : 'none' }}>
        <MenuDialog 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: theme.border.quaternary, 
            borderRadius: theme.radius.primary,
            width: 26,
            height: 26
          }}
          label={
            <KeyboardCommandKeyIcon style={{ fontSize: 15 }} />
          }
        >
          <MenuItem>{language['NO_OPTION']}</MenuItem>
        </MenuDialog> 
        <input ref={searchField} type='text' placeholder={language['SEARCH']} {...props} />
      </div>
      <IconButton className='search-btn' size='small' onClick={handleClick}><SearchIcon style={{ fontSize: 23 }} /></IconButton>
    </CustomSearchField>
  )
}

export const MiniSearchField = ({ ...props }) => {
  const searchField = useRef(document.createElement('input'))
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }

  useEffect(() => {
    if (!active) return
    searchField.current.focus()
  }, [active])

  return (
    <CustomMiniSearchField styled={theme} device={device} active={active ? 'active' : 'inactive'}>
      <div style={{ display: active ? 'flex' : 'none' }}>
        <MenuDialog 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: theme.border.quaternary, 
            borderRadius: theme.radius.primary,
            width: 26,
            height: 26
          }}
        >
          <MenuItem>{language['NO_OPTION']}</MenuItem>
        </MenuDialog> 
        <input ref={searchField} type='text' placeholder={language['SEARCH']} {...props} />
      </div>
      <IconButton className='search-btn' size='small' onClick={handleClick}><SearchIcon fontSize='small' /></IconButton>
    </CustomMiniSearchField>
  )
}

