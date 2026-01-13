import { IconButton } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { currencyFormat, dateFormat } from 'utils/index'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { TextHighlight } from 'components/shared/TextHighlight'

export const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'Invoice' },
  { id: 'customer', label: 'Customer' },
  { id: 'contact', label: 'Contact' },
  { id: 'totalLoan', label: 'Total\u00a0Loan' },
  { id: 'totalPaid', label: 'Total\u00a0Paid' },
  { id: 'totalRemain', label: 'Total\u00a0Remain' },
  { id: 'dueDate', label: 'Due\u00a0Date' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

const renderStatus = (status: string, theme: any) => {
  switch (status) {
    case 'REJECTED':
      return theme.color.error
    case 'IN_PROGRESS':
    case 'PENDING':
      return theme.color.warning
    case 'COMPLETED':
    case 'CLEARED':
      return theme.color.success
    case 'APPROVED':
      return theme.color.info
    default:
      return theme.text.primary
  }
}

export const mappedItem = (data, privilege, theme, onCancel, onDetail) => {
  const action = (
    <>
      {privilege?.loan?.cancel && (
        <IconButton
          size='small'
          onClick={() => onCancel(data._id)}
          style={{
            backgroundColor: `${theme.color.error}22`,
            borderRadius: theme.radius.primary,
            marginLeft: 5,
            color: theme.color.error,
          }}
        >
          <CloseRoundedIcon fontSize='small' />
        </IconButton>
      )}
      {privilege?.loan?.update && (
        <IconButton
          size='small'
          onClick={() => onDetail(data._id)}
          style={{
            backgroundColor: `${theme.color.info}22`,
            borderRadius: theme.radius.primary,
            marginLeft: 5,
            color: theme.color.info,
          }}
        >
          <AttachMoneyRoundedIcon fontSize='small' />
        </IconButton>
      )}
    </>
  )
  return {
    _id: data._id,
    invoice: data.payment?.invoice,
    customer: data.customer?.displayName || '...',
    contact: data.customer?.contact || '...',
    totalLoan: currencyFormat(data.totalLoan.USD, 'USD'),
    totalPaid: currencyFormat(data.totalPaid.value, data.totalPaid.currency),
    totalRemain: currencyFormat(data.totalRemain.USD, 'USD'),
    dueDate: dateFormat(null),
    status: <TextHighlight text={data.status} color={renderStatus(data.status,theme)} />,
    action,
  }
}
