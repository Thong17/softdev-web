import { useState } from 'react'
import { IconButton, Menu, MenuItem, ListItemText } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import useTheme from 'hooks/useTheme'

interface IIconDropdownOption {
  value: string
  label: string
}

interface IIconDropdown {
  icon: React.ReactNode
  value: string
  options: IIconDropdownOption[]
  onChange: (value: string) => void
  ariaLabel: string
}

export const IconDropdown = ({ icon, value, options, onChange, ariaLabel }: IIconDropdown) => {
  const { theme } = useTheme()
  const [anchor, setAnchor] = useState<Element | null>(null)

  const handleSelect = (option: string) => {
    onChange(option)
    setAnchor(null)
  }

  return (
    <>
      <IconButton
        size='small'
        onClick={(event) => setAnchor(event.currentTarget)}
        style={{ color: theme.text.secondary }}
        aria-label={ariaLabel}
      >
        {icon}
      </IconButton>
      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { backgroundColor: theme.background.secondary, borderRadius: theme.radius.quaternary } }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => handleSelect(option.value)}
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, minWidth: 160 }}
          >
            <ListItemText sx={{ color: theme.text.primary }}>{option.label}</ListItemText>
            {option.value === value && <CheckRoundedIcon fontSize='small' sx={{ color: theme.color.info }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
