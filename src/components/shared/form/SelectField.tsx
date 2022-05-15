import { MenuItem, Select, SelectProps } from '@mui/material'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { FC } from 'react'
import { CustomSelect } from 'styles'

interface IOptions {
  value: any
  label: string
}

interface ISelectField extends SelectProps {
  options: Array<IOptions>
  name?: string
  label?: string
}

const SelectInput: FC<ISelectField> = ({ options, name, label, ...props }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <CustomSelect styled={theme} device={device}>
      <label htmlFor={name}>{label}</label>
      <Select
        id={name}
        name={name}
        MenuProps={{ sx: { '& .MuiPaper-root': { backgroundColor: theme.background.primary, color: theme.text.primary } } }}
        {...props}
      >
        {options.map((item, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          )
        })}
      </Select>
    </CustomSelect>
  )
}

export default SelectInput
