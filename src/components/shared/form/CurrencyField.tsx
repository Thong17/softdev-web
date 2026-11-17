import { forwardRef, ForwardRefRenderFunction, InputHTMLAttributes, ReactElement } from 'react'
import { SelectProps } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { currencyOptions } from 'constants/variables'
import { TextField } from './InputField'
import { IOptions, MiniSelectField } from './SelectField'

type IPicker = Partial<SelectProps> & { value: any; options?: IOptions[]; width?: number }

interface ICurrencyField extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  err?: string
  hint?: string
  // Shown inside the input, just before the currency picker
  icon?: ReactElement
  // The currency picker shown inside the input, on the right. Pass the
  // react-hook-form register() result for the currency field here, plus
  // its current value (or an onChange for plain state).
  currency: IPicker
  // A second picker after the currency, e.g. a duration (per hour/day)
  extra?: IPicker
}

const SELECT_WIDTH = 64
// Divider padding plus the gap between pickers
const PICKER_SPACE = 14

// A number input with its currency picker inside it, on the right
const Input: ForwardRefRenderFunction<HTMLInputElement, ICurrencyField> = (
  { label, err, hint, icon, currency, extra, style, ...props },
  ref
) => {
  const { theme } = useTheme()
  const pickers = [{ options: currencyOptions, ...currency }, ...(extra ? [extra] : [])]
  const pickersWidth = pickers.reduce((total, picker) => total + (picker.width ?? SELECT_WIDTH) + PICKER_SPACE, 0)

  return (
    // The pickers sit beside the input rather than inside its styled box, so
    // the text input's styles don't reach the select's own hidden input
    <div style={{ position: 'relative' }}>
      <TextField
        ref={ref}
        type='number'
        step='any'
        label={label}
        err={err}
        hint={hint}
        style={{ paddingRight: pickersWidth + (icon ? 30 : 0), ...style }}
        {...props}
      />
      <div
        style={{
          position: 'absolute',
          // Input starts 30px down and is 37px tall; the picker is 30px tall
          top: 34,
          right: 4,
          height: 30,
          zIndex: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {icon && (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: theme.text.secondary }}>
            {icon}
          </div>
        )}
        {pickers.map(({ options = [], value, width, ...selectProps }, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 8, borderLeft: theme.border.quaternary }}>
            <MiniSelectField
              value={value ?? ''}
              options={options}
              width={width ?? SELECT_WIDTH}
              {...(selectProps as any)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export const CurrencyField = forwardRef(Input)
