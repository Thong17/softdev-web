import { Box, IconButton } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React, { useState } from 'react'
import { CustomerDialog } from '../dialog/CustomerDialog'
import { TextEllipsis } from '../TextEllipsis'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const CustomerField = ({ err, onChange }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const [customerDialog, setCustomerDialog] = useState({ open: false })
  const [customer, setCustomer] = useState({
    displayName: null,
    id: null,
    point: 0,
  })
  return (
    <>
      <CustomerDialog
        dialog={customerDialog}
        setDialog={setCustomerDialog}
        onClickCustomer={(data) => {
          setCustomer(data)
          onChange(data)
        }}
      />
      <div
        onClick={() => setCustomerDialog({ ...customerDialog, open: true })}
        style={{
          height: '100%',
          padding: '30px 0 20px 0',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 37,
            width: '100%',
            border: err
              ? `1px solid ${theme.color.error}`
              : theme.border.quaternary,
            borderRadius: theme.radius.primary,
            padding: '5px 15px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            transition: '0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              border: theme.border.tertiary,
            },
            '&:hover span': {
              color: `${theme.text.secondary} !important`,
            },
            '& .input-error': {
              color: theme.color.error,
              position: 'absolute',
              bottom: -16,
              left: 7,
              fontSize: theme.responsive[device]?.text.quaternary,
            },
          }}
        >
          <span
            style={{
              color: customer?.displayName
                ? theme.text.primary
                : theme.text.quaternary,
              transition: '0.2s ease',
            }}
          >
            {customer?.displayName || language['CUSTOMER']}
          </span>
          {customer.id && <IconButton sx={{ position: 'absolute', right: 0 }} aria-label="delete" onClick={(e) => {
            setCustomer({
              displayName: null,
              id: null,
              point: 0,
            })
            onChange({
              id: ''
            })
            e.stopPropagation()
          }}>
            <CloseRoundedIcon sx={{ fontSize: 18, color: theme.text.tertiary }} />
          </IconButton>}
          {err && (
            <TextEllipsis className='input-error'>
              {err}
            </TextEllipsis>
          )}
        </Box>
      </div>
    </>
  )
}
