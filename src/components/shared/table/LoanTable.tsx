import { Box, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { currencyFormat, dateFormat } from 'utils/index'
import { ITableColumn, StickyTable } from './StickyTable'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import useTheme from 'hooks/useTheme'
import { LoanStatus } from '../LoanStatus'

const columnData: ITableColumn<any>[] = [
  { id: 'dueDate', label: 'DUE_DATE' },
  { id: 'principalAmount', label: 'PRINCIPAL_AMOUNT' },
  { id: 'interestAmount', label: 'INTEREST_AMOUNT' },
  { id: 'totalAmount', label: 'TOTAL_AMOUNT' },
  { id: 'principalBalance', label: 'PRINCIPAL_BALANCE' },
  { id: 'status', label: 'STATUS' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

const mapData = (data, theme, onPayment) => {
  const action = (
    <>
      <IconButton
        size='small'
        onClick={() => onPayment(data)}
        style={{
          backgroundColor: `${theme.color.info}22`,
          borderRadius: theme.radius.primary,
          marginLeft: 5,
          color: theme.color.info,
        }}
      >
        <AttachMoneyRoundedIcon fontSize='small' />
      </IconButton>
    </>
  )
  return {
    dueDate: dateFormat(data.dueDate),
    principalAmount: currencyFormat(
      data.principalAmount.value,
      data.principalAmount.currency
    ),
    interestAmount: currencyFormat(
      data.interestAmount.value,
      data.interestAmount.currency
    ),
    totalAmount: currencyFormat(
      data.totalAmount.value,
      data.totalAmount.currency
    ),
    principalBalance: currencyFormat(
      data.principalBalance.value,
      data.principalBalance.currency
    ),
    status: <LoanStatus dueDate={data.dueDate} />,
    action,
  }
}

const LoanTable = ({ data }) => {
  const [rowData, setRowData] = useState<any>([])
  const { theme } = useTheme()

  useEffect(() => {
    if (!data) return
    const handlePayment = (data) => {
      console.log(data)
    }
    setRowData(data.map((item) => mapData(item, theme, handlePayment)))
    // eslint-disable-next-line
  }, [data])

  return (
    <Box>
      <StickyTable columns={columnData} rows={rowData} pagination={false} />
    </Box>
  )
}

export default LoanTable
