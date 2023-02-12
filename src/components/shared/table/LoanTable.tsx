import { Box, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { currencyFormat, dateFormat } from 'utils/index'
import { ITableColumn, StickyTable } from './StickyTable'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import useTheme from 'hooks/useTheme'
import { LoanStatus } from '../LoanStatus'
import { LoanPaymentDialog } from 'modules/sale/loan/LoanPaymentDialog'
import useAuth from 'hooks/useAuth'
import { IPaymentInfo } from '../form/PaymentForm'
import useNotify from 'hooks/useNotify'

const columnData: ITableColumn<any>[] = [
  { id: 'dueDate', label: 'DUE_DATE' },
  { id: 'principalAmount', label: 'PRINCIPAL_AMOUNT' },
  { id: 'interestAmount', label: 'INTEREST_AMOUNT' },
  { id: 'totalAmount', label: 'TOTAL_AMOUNT' },
  { id: 'principalBalance', label: 'PRINCIPAL_BALANCE' },
  { id: 'status', label: 'STATUS' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

const mapData = (data, theme, onPayment, onPrint) => {
  const action = data.isPaid ? (
    <IconButton
      size='small'
      onClick={() => onPrint(data)}
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.info,
      }}
    >
      <PrintRoundedIcon fontSize='small' />
    </IconButton>
  ) : (
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
    status: <LoanStatus dueDate={data.dueDate} isPaid={data.isPaid} />,
    action,
  }
}

const LoanTable = ({ data }) => {
  const [rowData, setRowData] = useState<any>([])
  const { theme } = useTheme()
  const [depositDialog, setDepositDialog] = useState<any>({
    open: false,
    payment: null,
  })
  const { user } = useAuth()
  const { notify } = useNotify()

  useEffect(() => {
    if (!data) return
    if (!user?.drawer) return notify('No drawer opened', 'error')

    const handlePayment = (data) => {
      setDepositDialog({
        open: true,
        payment: mapPayment(data, user?.drawer),
        detail: data,
      })
    }

    const handlePrint = () => {
      // TODO: add print loan payment
    }

    setRowData(data.map((item) => mapData(item, theme, handlePayment, handlePrint)))
    // eslint-disable-next-line
  }, [data])

  return (
    <Box>
      <LoanPaymentDialog dialog={depositDialog} setDialog={setDepositDialog} />
      <StickyTable columns={columnData} rows={rowData} pagination={false} />
    </Box>
  )
}

const mapPayment = (data, rate): IPaymentInfo => {
  return {
    _id: data._id,
    rate,
    customer: data.customer,
    remainTotal: {
      USD: data.totalAmount.value,
      KHR: data.totalAmount.value * rate.sellRate,
    },
    returnCashes: [],
    status: false,
    total: {
      value: data.totalAmount.value,
      currency: data.totalAmount.currency,
    },
  }
}

export default LoanTable
