import { Box, IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { compareDate, currencyFormat, dateFormat } from 'utils/index'
import { ITableColumn, StickyTable } from './StickyTable'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import useTheme from 'hooks/useTheme'
import { LoanStatus } from '../LoanStatus'
import { LoanPaymentDialog } from 'modules/sale/loan/LoanPaymentDialog'
import useAuth from 'hooks/useAuth'
import { IPaymentInfo } from '../form/PaymentForm'
import useNotify from 'hooks/useNotify'
import { calculatePrepaymentPenalty } from 'modules/sale/loan/DepositDialog'
import { useReactToPrint } from 'react-to-print'
import { PaymentReceipt } from '../invoice/PaymentReceipt'

const columnData: ITableColumn<any>[] = [
  { id: 'dueDate', label: 'DUE_DATE' },
  { id: 'principalAmount', label: 'PRINCIPAL_AMOUNT' },
  { id: 'interestAmount', label: 'INTEREST_AMOUNT' },
  { id: 'principalBalance', label: 'PRINCIPAL_BALANCE' },
  { id: 'totalAmount', label: 'TOTAL_AMOUNT' },
  { id: 'status', label: 'STATUS' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

const mapData = (data, theme, allowPayment, onPayment, onPrint) => {
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
      disabled={!allowPayment}
      style={{
        backgroundColor: allowPayment ? `${theme.color.info}22` : `${theme.text.quaternary}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: allowPayment ? theme.color.info : theme.text.quaternary,
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
    status: <LoanStatus dueDate={data.dueDate} isPaid={data.isPaid} isClosed={data.isClosed} />,
    action: data.isClosed ? <></> : action,
  }
}

const LoanTable = ({ data, detail }) => {
  const [rowData, setRowData] = useState<any>([])
  const { theme } = useTheme()
  const [depositDialog, setDepositDialog] = useState<any>({
    open: false,
    payment: null,
  })
  const { user } = useAuth()
  const { notify } = useNotify()

  const handlePrint = useReactToPrint({
    content: () => invoiceRef?.current,
    documentTitle: 'Invoice',
  })

  useEffect(() => {
    if (!data) return
    if (!user?.drawer) return notify('No drawer opened', 'error')

    const nextDueId = data.filter(item => !item.isPaid)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())?.[0]?._id

    const handlePayment = (data) => {
      setDepositDialog({
        open: true,
        payment: mapPayment(data, detail, user?.drawer),
        detail: data,
      })
    }

    setRowData(data.map((item) => mapData(item, theme, item._id === nextDueId, handlePayment, handlePrint)))
    // eslint-disable-next-line
  }, [data])

  const invoiceRef = useRef(document.createElement('div'))

  return (
    <Box>
      <div style={{ position: 'absolute', top: '-200%' }}>
        <div ref={invoiceRef}>
          <PaymentReceipt payment={data?.payment} />
        </div>
      </div>
      <LoanPaymentDialog dialog={depositDialog} setDialog={setDepositDialog} />
      <StickyTable columns={columnData} rows={rowData} pagination={false} />
    </Box>
  )
}

const mapPayment = (data, detail, rate): IPaymentInfo => {
  const mappedData = {
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

  const isOverdue = compareDate(Date.now(), new Date(data.dueDate))
  // TODO: calculate overdue penalty
  if (isOverdue) {
    const penalty = calculatePrepaymentPenalty(
        [data],
        detail?.overdue,
        detail?.payment.rate
      )
    mappedData.total.value += penalty
    mappedData.remainTotal.USD += penalty
    mappedData.remainTotal.KHR += penalty * rate.sellRate
    mappedData['penalty'] = { USD: penalty, KHR: penalty * rate.sellRate }
  }
  return mappedData
}

export default LoanTable
