import { Box } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { currencyFormat } from 'utils/index'
import { renderDirection } from '../container/LoanDetail'

const LoanInvoice = ({ data }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [totalPenalty, setTotalPenalty] = useState(0)
  const [totalRemain, setTotalRemain] = useState(0)

  useEffect(() => {
    setTotalPenalty(
      calculatePrepaymentPenalty(
        data?.loanPayments,
        data?.prepayment,
        data?.payment.rate
      )
    )
  }, [data?.loanPayments, data?.prepayment, data?.payment.rate])

  useEffect(() => {
    setTotalRemain(data?.totalRemain.USD)
  }, [data?.totalRemain.USD])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingTop: '30px',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          backgroundColor: `${theme.background.secondary}cc`,
          gap: '10px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          borderRadius: theme.radius.ternary,
          padding: '10px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}></Box>
        <Box sx={{ width: '100%', height: '270px' }}>
          <Box
            sx={{
              position: 'relative',
              backgroundColor: `${theme.background.primary}99`,
              height: '70%',
              borderRadius: theme.radius.ternary,
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 20px',
              boxSizing: 'border-box',
              '&::before': {
                content: `''`,
                ...renderDirection('column', theme),
                display: 'block',
              },
            }}
          >
            <InvoiceDetail
              label={language['TOTAL_REMAIN']}
              value={currencyFormat(totalRemain, 'USD')}
            />
            <InvoiceDetail
              label={language['TOTAL_PENALTY']}
              value={currencyFormat(totalPenalty, 'USD')}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: `${theme.background.primary}99`,
              height: '30%',
              borderRadius: theme.radius.ternary,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 20px',
            }}
          >
            <Box component='span'>{language['GRAND_TOTAL']}</Box>
            <Box component='span'>{currencyFormat(totalRemain + totalPenalty, 'USD')}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const InvoiceDetail = ({ label, value }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 0',
      }}
    >
      <Box component='span'>{label}</Box>
      <Box component='span'>{value}</Box>
    </Box>
  )
}

const calculatePrepaymentPenalty = (loanPayments, penalty, rate) => {
  switch (penalty.currency) {
    case 'USD':
      return penalty.value

    case 'KHR':
      return penalty.value / rate.sellRate

    default:
      let totalPenalty = 0
      loanPayments
        .filter((item) => !item.isPaid && !item.isDeleted)
        .forEach((item) => {
          totalPenalty += (item.principalBalance.value * penalty.value) / 100
        })
      return totalPenalty
  }
}

export default LoanInvoice
