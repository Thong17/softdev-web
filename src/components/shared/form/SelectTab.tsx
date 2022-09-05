import * as React from 'react'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import useTheme from 'hooks/useTheme'
import { IThemeStyle } from 'contexts/theme/interface'

interface StyledTabsProps {
  children?: React.ReactNode
  value: any
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))(({ styled }: { styled: IThemeStyle }) => ({
  minHeight: 30,
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    borderRadius: 3,
    maxWidth: 20,
    width: '100%',
    backgroundColor: styled.color.info,
  },
}))

interface StyledTabProps {
  label: string
  value: any
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ styled }: { styled: IThemeStyle }) => ({
  textTransform: 'none',
  color: styled.text.tertiary,
  padding: '0 20px',
  minHeight: 30,
  minWidth: 50,
  '&.Mui-selected': {
    color: styled.text.primary,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}))

export const SelectTab = ({ selected, options, onChange }: any) => {
  const { theme } = useTheme()
  const [value, setValue] = React.useState(selected ? selected : options.length > 0 ? options[0]?.value : '')

  React.useEffect(() => {
    setValue(selected)
  }, [selected])

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <StyledTabs
      styled={theme}
      value={value}
      onChange={handleChange}
      aria-label='styled tabs'
    >
      {options.map((option, key) => (
        <StyledTab
          styled={theme}
          key={key}
          label={option.label}
          value={option.value}
        />
      ))}
    </StyledTabs>
  )
}
