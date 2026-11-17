import useTheme from 'hooks/useTheme'

interface IUnitInput {
  value: string
  unit: string
  units: { value: string; label: string }[]
  onChangeValue: (value: string) => void
  onChangeUnit: (unit: string) => void
  error?: boolean
  placeholder?: string
}

// A plain number box (36px, label above it) with its unit picker inside it on
// the right, e.g. a fee in % / $ / ៛. The floating-label forms use
// CurrencyField instead.
export const UnitInput = ({ value, unit, units, onChangeValue, onChangeUnit, error, placeholder = '0' }: IUnitInput) => {
  const { theme } = useTheme()

  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 36,
        boxSizing: 'border-box',
        // One border value: mixing border and borderColor makes React warn
        // when the error turns on or off
        border: error ? `1px solid ${theme.color.error}` : theme.border.quaternary,
        borderRadius: theme.radius.primary,
      }}
    >
      <input
        type='number'
        min='0'
        step='any'
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChangeValue(event.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          padding: '0 10px',
          border: 'none',
          background: 'transparent',
          color: theme.text.primary,
          fontFamily: 'inherit',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <select
        value={unit}
        onChange={(event) => onChangeUnit(event.target.value)}
        style={{
          height: 24,
          padding: '0 6px',
          border: 'none',
          borderLeft: theme.border.quaternary,
          background: 'transparent',
          color: theme.text.secondary,
          fontFamily: 'inherit',
          fontSize: 14,
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {units.map((item) => (
          // Native options get the OS colors unless set
          <option key={item.value} value={item.value} style={{ backgroundColor: theme.background.primary, color: theme.text.primary }}>
            {item.label}
          </option>
        ))}
      </select>
    </span>
  )
}

export const feeUnits = [
  { value: 'PCT', label: '%' },
  { value: 'USD', label: '$' },
  { value: 'KHR', label: '៛' },
]
