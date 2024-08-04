import { Box } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { currencyFormat } from 'utils/index'
import { renderDirection } from '../container/LoanDetail'
import { ITableColumn, StickyTable } from '../table/StickyTable'

const columnData: ITableColumn<any>[] = [
  { id: 'principalBalance', label: 'PRINCIPAL_BALANCE' },
  { id: 'prepaymentInterest', label: 'INTEREST' },
  { id: 'totalInterest', label: 'TOTAL', align: 'right' },
]

const LoanInvoice = ({ data, totalRemain, totalPenalty }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    setRowData(data?.loanPayments
      ?.filter((item) => !item.isPaid && !item.isDeleted)
      .map((item) => (
        {
          principalBalance: currencyFormat(item.principalBalance.value, 'USD'),
          prepaymentInterest: currencyFormat(data.prepayment.value, data.prepayment.currency),
          totalInterest: currencyFormat(
            (item.principalBalance.value * data.prepayment.value) / 100,
            'USD'
          )
        }
      )))
  }, [data?.loanPayments, data?.prepayment, data?.payment.rate])

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
          flexDirection: 'column-reverse',
          width: '100%',
          height: '100%',
          borderRadius: theme.radius.ternary,
          padding: '10px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <Box sx={{
          boxSizing: 'border-box',
          marginTop: '11px',
          padding: '0 10px 30px 10px',
          width: '100%',
          height: 'calc(100% - 150px)',
          position: 'absolute',
          top: 0,
          left: 0,
          overflowY: 'auto',
        }}>
          <StickyTable backgroundColor='secondary' columns={columnData} rows={rowData} pagination={false} />
        </Box>
        <Box sx={{ width: '100%', height: '130px' }}>
          <Box
            sx={{
              position: 'relative',
              backgroundColor: `${theme.background.primary}99`,
              height: '65%',
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
              color={theme.color.error}
              label={language['TOTAL_PENALTY']}
              value={currencyFormat(totalPenalty, 'USD')}
            />
            <InvoiceDetail
              color={theme.text.secondary}
              label={language['TOTAL_REMAIN']}
              value={currencyFormat(Math.max(0, totalRemain), 'USD')}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: `${theme.background.primary}99`,
              height: '35%',
              borderRadius: theme.radius.ternary,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 20px',
            }}
          >
            <Box component='span'>{language['GRAND_TOTAL']}</Box>
            <Box component='span'>
              {currencyFormat(Math.max(0, totalRemain + totalPenalty), 'USD')}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const InvoiceDetail = ({ label, value, color }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 0',
      }}
    >
      <Box component='span'>{label}</Box>
      <Box component='span' sx={{ color }}>{value}</Box>
    </Box>
  )
}

export default LoanInvoice
