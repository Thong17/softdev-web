import { MenuItem, Select, SelectProps, CircularProgress } from '@mui/material'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef, InputHTMLAttributes, ForwardRefRenderFunction, useEffect, useState } from 'react'
import { CustomSelect } from 'styles'

export interface IOptions {
  value: any
  label: string
  selected?: boolean
}

interface ISelectField extends SelectProps {
  options: Array<IOptions>
  name?: string
  value?: string
  label?: string
  err?: string
  hint?: string
  loading?: boolean
}

const Input: ForwardRefRenderFunction<InputHTMLAttributes<HTMLSelectElement>, ISelectField> = ({ options, name, value, label, err, hint, loading, ...props }, ref) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const [defaultValue, setDefault] = useState(value)
  useEffect(() => {
    setDefault(value)
  }, [value])
  
  return (
    <CustomSelect styled={theme} device={device} value={defaultValue}>
      <Select
        value={value}
        ref={ref}
        id={name}
        name={name}
        className={err && 'input-error'}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              backgroundColor: theme.background.primary,
              color: theme.text.primary,
            },
          },
        }}
        {...props}
      >
        {!loading ? options.map((item, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          )
        }) : <CircularProgress />}
      </Select>
      <label htmlFor={name}>{label}</label>
      <div className="err">{err}</div>
      <div className="hint">{hint}</div>

    </CustomSelect>
  )
}

const SelectField = forwardRef(Input)
export { SelectField }
