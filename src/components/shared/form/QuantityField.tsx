import { IconButton } from '@mui/material'
import { useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { NanoInput } from './InputField'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'

export const QuantityField = ({ onChange, value }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [quantity, setQuantity] = useState<number>(value || 0)

  const handleOnFocus = (event) => event.target.select()

  const handleChangeQuantity = (event) => {
    const quantity = event.target.value
    setQuantity(quantity)
    onChange(quantity)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '20%',
      }}
    >
      <IconButton
        onClick={() =>
          setQuantity((prev) => {
            const quantity =
              typeof prev === 'string' ? parseInt(prev || 1) - 1 : prev - 1
            onChange(quantity)
            return quantity
          })
        }
        style={{
          width: 30,
          height: 30,
        }}
      >
        <RemoveRoundedIcon
          style={{ fontSize: 16, color: theme.text.secondary }}
        />
      </IconButton>
      <NanoInput
        type='number'
        step='any'
        name='quantity'
        placeholder={language['UNIT']}
        width={50}
        value={quantity}
        onChange={handleChangeQuantity}
        onFocus={handleOnFocus}
      />
      <IconButton
        onClick={() =>
          setQuantity((prev) => {
            const quantity =
              typeof prev === 'string' ? parseInt(prev || 1) + 1 : prev + 1
            onChange(quantity)
            return quantity
          })
        }
        style={{
          width: 30,
          height: 30,
        }}
      >
        <AddRoundedIcon style={{ fontSize: 16, color: theme.text.secondary }} />
      </IconButton>
    </div>
  )
}
