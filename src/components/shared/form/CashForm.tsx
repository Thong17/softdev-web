import React, { useEffect, useState } from 'react'
import { MiniSelectField } from '.'
import { NanoInput } from './InputField'
import { currencyOptions } from './InvoiceForm'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { Box } from '@mui/system'
import { currencyFormat } from 'utils'

const initCash = { value: '0', currency: 'USD', quantity: 1 }

export const CashForm = ({ onChange }) => {
  const { theme } = useTheme()
  const [cashForm, setCashForm] = useState(initCash)
  const [cashes, setCashes] = useState<any[]>([])

  useEffect(() => {
    onChange(cashes)
  }, [cashes, onChange])

  const handleSubmit = (event) => {
    event.preventDefault()
    setCashes([...cashes, cashForm])
  }

  return (
    <div
      style={{ position: 'relative', height: '100%', boxSizing: 'border-box' }}
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
            },
          }}
        >
          <div className='money'>1$</div>
          <div className='money'>10$</div>
          <div className='money'>20$</div>
          <div className='money'>50$</div>
          <div className='money'>100$</div>
          <div className='money'>1000$</div>
          <div className='money'>10000$</div>
          <div className='money'>50$</div>
          <div className='money'>1$</div>
          <div className='money'>10$</div>
          <div className='money'>20$</div>
          <div className='money'>50$</div>
          <div className='money'>100$</div>
          <div className='money'>1000$</div>
          <div className='money'>10000$</div>
          <div className='money'>50$</div>
        </Box>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto',
          boxSizing: 'border-box',
          height: 'calc(45.3vh)',
          paddingTop: 10
        }}
      >
        {cashes?.map((cash, key) => (
          <div
            style={{ backgroundColor: 'rebeccapurple', padding: 10 }}
            key={key}
          >
            {currencyFormat(parseFloat(cash.value), cash.currency)}
          </div>
        ))}
      </div>
    </div>
  )
}
