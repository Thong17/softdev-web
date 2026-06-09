import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { MiniSelectField } from './SelectField'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { IconButton } from '@mui/material'

const ComboField = ({ onChange, defaultValue, selectOption, name = '', checkbox = true }) => {
  const { theme } = useTheme()
  const [input, setInput] = useState(defaultValue.input)
  const [select, setSelect] = useState(defaultValue.select || 'PCT')
  const [check, setCheck] = useState(defaultValue.check || false)

  const handleChangeInput = (event) => {
    const v = event.target.value
    if (v === '') {
      setInput(v)
      return
    }
    const num = parseFloat(v)
    if (Number.isNaN(num)) {
      setInput('')
      return
    }
    // enforce non-negative values
    if (num < 0) {
      setInput(String(Math.abs(num)))
      return
    }
    setInput(v)
  }

  const handleKeyDownInput = (event) => {
    // prevent entering invalid characters: e, E, +, - (exponent/negative)
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
      event.preventDefault()
    }
  }

  const handleChangeSelect = (event) => {
    setSelect(event.target.value)
  }

  const handleToggleCheck = () => {
    setCheck(!check)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onChange({input, select, check})
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <style>{`.combo-number-input::-webkit-outer-spin-button, .combo-number-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .combo-number-input { -moz-appearance: textfield; appearance: textfield; }`}</style>
      <input
        onFocus={(event) => event.target.select()}
        autoFocus
        value={input}
        placeholder={name}
        type='number'
        step='any'
        min={0}
        onKeyDown={handleKeyDownInput}
        onChange={handleChangeInput}
        className='combo-number-input'
        style={{
          width: 37,
          padding: '2px 5px 2px 2px',
          outline: 'none',
          border: 'none',
          background: 'none',
          borderRadius: theme.radius.primary,
          color: theme.text.secondary,
        }}
      />
      <MiniSelectField
        width={33}
        value={select}
        options={selectOption}
        onChange={handleChangeSelect}
        sx={{
          position: 'absolute',
          top: -10,
          right: 0,
          height: 19,
          minWidth: 0,
          '& .MuiSvgIcon-root': {
            right: 0,
            top: -4
          },
        }}
      />
      {checkbox && (check ? <CheckBoxRoundedIcon onClick={handleToggleCheck} style={{ fontSize: 17, cursor: 'pointer' }} /> : <CheckBoxOutlineBlankRoundedIcon onClick={handleToggleCheck} style={{ fontSize: 17, cursor: 'pointer' }} />)}
      <IconButton type='submit' style={{ color: theme.text.secondary, width: 30, height: 30 }}><CheckRoundedIcon style={{ fontSize: 17 }} /></IconButton>
    </form>
  )
}

export default ComboField
