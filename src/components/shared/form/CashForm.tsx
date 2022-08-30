import React, { useEffect, useState } from 'react'
import { MiniSelectField } from '.'
import { NanoInput } from './InputField'
import { currencyOptions } from './InvoiceForm'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { Box } from '@mui/system'
import { currencyFormat, generateId } from 'utils'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { ValueLabel } from '../ValueLabel'
import { QuantityField } from './QuantityField'

const initCash = { value: '0', currency: 'USD', quantity: 1 }

const presetCashes = [
  {
    value: 1,
    currency: 'USD',
    quantity: 1,
  },
  {
    value: 10,
    currency: 'USD',
    quantity: 1,
  },
  {
    value: 20,
    currency: 'USD',
    quantity: 1,
  },
  {
    value: 50,
    currency: 'USD',
    quantity: 1,
  },
  {
    value: 100,
    currency: 'USD',
    quantity: 1,
  },
  {
    value: 100,
    currency: 'KHR',
    quantity: 1,
  },
  {
    value: 1000,
    currency: 'KHR',
    quantity: 1,
  },
  {
    value: 5000,
    currency: 'KHR',
    quantity: 1,
  },
  {
    value: 10000,
    currency: 'KHR',
    quantity: 1,
  },
  {
    value: 50000,
    currency: 'KHR',
    quantity: 1,
  },
  {
    value: 100000,
    currency: 'KHR',
    quantity: 1,
  },
]

const CastPreset = ({ theme, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        alignItems: 'center',
        gridColumnGap: 10,
        boxSizing: 'border-box',
        '& .money': {
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          padding: '0 10px',
          backgroundColor: theme.background.secondary,
          borderRadius: theme.radius.primary,
          cursor: 'pointer',
          lineHeight: 1,
        },
      }}
    >
      {presetCashes.map((cash, key) => (
        <div className='money' onClick={() => onClick(cash)} key={key}>
          {currencyFormat(cash.value, cash.currency)}
        </div>
      ))}
    </Box>
  )
}

export const CashForm = ({ onChange }) => {
  const { theme } = useTheme()
  const [cashForm, setCashForm] = useState(initCash)
  const [cashes, setCashes] = useState<any[]>([])

  useEffect(() => {
    onChange(cashes)
  }, [cashes, onChange])

  const handleSubmit = (event) => {
    event.preventDefault()
    setCashes([...cashes, { ...cashForm, id: generateId() }])
  }

  const handleRemoveCash = (id) => {
    setCashes((prev) => prev.filter((cash) => cash.id !== id))
  }

  const handleChangeQuantity = (id, value) => {
    setCashes((prev) =>
      prev.map((cash) => (cash.id === id ? { ...cash, quantity: value } : cash))
    )
  }

  return (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative' }}>
            <NanoInput
              onChange={(event) =>
                setCashForm({ ...cashForm, value: event.target.value })
              }
              type='number'
              label='Price'
              height={33}
              width={230}
              placeholder='Cash'
              value={cashForm.value}
              icon={
                <div
                  style={{ position: 'absolute', right: 0, display: 'flex' }}
                >
                  <MiniSelectField
                    onChange={(event) =>
                      setCashForm({
                        ...cashForm,
                        currency: event.target.value as string,
                      })
                    }
                    value={cashForm.currency}
                    options={currencyOptions}
                    name='currency'
                    width={33}
                    sx={{
                      position: 'absolute',
                      top: -30,
                      right: 23,
                      height: 23,
                      '& div': {
                        paddingRight: '0 !important',
                      },
                      '& .MuiSelect-select': {
                        position: 'absolute',
                        top: -2,
                      },
                      '& .MuiSvgIcon-root': {
                        top: -1,
                        right: 0,
                      },
                    }}
                  />
                  <IconButton
                    type='submit'
                    style={{
                      width: 30,
                      height: 30,
                      color: theme.text.secondary,
                      position: 'absolute',
                      top: -31,
                      right: 1,
                    }}
                  >
                    <AddRoundedIcon style={{ fontSize: 18 }} />
                  </IconButton>
                </div>
              }
            />
          </div>
        </form>
        <CastPreset
          theme={theme}
          onClick={(cash) =>
            setCashes([...cashes, { ...cash, id: generateId() }])
          }
        />
      </div>
      <div style={{ position: 'relative', height: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflowY: 'auto',
            boxSizing: 'border-box',
            maxHeight: '100%',
            width: '100%',
            position: 'absolute',
          }}
        >
          {cashes?.map((cash, key) => (
            <CashItem
              key={key}
              cash={cash}
              onRemove={handleRemoveCash}
              onChange={handleChangeQuantity}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const CashItem = ({ cash, onRemove, onChange }) => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        backgroundColor: theme.background.secondary,
        padding: '5px 10px',
        borderRadius: theme.radius.primary,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span style={{ flex: '30%' }}>
        <ValueLabel
          icon={
            <PaymentsRoundedIcon
              style={{
                margin: '0 5px',
                fontSize: 15,
                color: theme.text.quaternary,
              }}
            />
          }
          value={currencyFormat(parseFloat(cash.value), cash.currency)}
        />
      </span>
      <div style={{ flex: '20%' }}>
        <QuantityField
          value={cash.quantity}
          onChange={(value) => onChange(cash.id, value)}
        />
      </div>
      <div
        style={{
          flex: '50%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <ValueLabel
            label='Total'
            value={currencyFormat(
              parseFloat(cash.value) * cash.quantity,
              cash.currency
            )}
          />
        </div>
        <IconButton
          onClick={() => onRemove(cash.id)}
          style={{
            color: theme.color.error,
            width: 30,
            height: 30,
            marginLeft: 10,
          }}
        >
          <CloseRoundedIcon style={{ fontSize: 19 }} />
        </IconButton>
      </div>
    </div>
  )
}
