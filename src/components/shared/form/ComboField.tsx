import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import { MiniSelectField } from './SelectField'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

const ComboField = ({ onChange, selectOption, name = '', checkbox = true }) => {
  const { theme } = useTheme()
  const [input, setInput] = useState('0')
  const [select, setSelect] = useState('USD')
  const [check, setCheck] = useState(false)

  const handleChangeInput = (event) => {
    setInput(event.target.value)
  }

  const handleChangeSelect = (event) => {
    setSelect(event.target.value)
  }

  const handleToggleCheck = () => {
    setCheck(!check)
  }

  const handleSubmit = () => {
    onChange({input, select, check})
  }

  return (
    <div
      style={{
        display: 'flex',
        borderBottom: theme.border.quaternary,
        position: 'relative',
      }}
    >
      <input
        value={input}
        placeholder={name}
        type='number'
        maxLength={3}
        onChange={handleChangeInput}
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
        value={select}
        options={selectOption}
        onChange={handleChangeSelect}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: 23,
          minWidth: 0,
          '& .MuiSvgIcon-root': {
            right: 0,
            top: -4
          },
        }}
      />
      {checkbox && (check ? <CheckBoxRoundedIcon onClick={handleToggleCheck} style={{ fontSize: 17, cursor: 'pointer' }} /> : <CheckBoxOutlineBlankRoundedIcon onClick={handleToggleCheck} style={{ fontSize: 17, cursor: 'pointer' }} />)}
      <CheckRoundedIcon onClick={handleSubmit} style={{ fontSize: 17, marginLeft: 5, cursor: 'pointer' }} />
    </div>
  )
}

export default ComboField
