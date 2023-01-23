import { IconButton } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { currencyFormat, dateFormat } from 'utils/index'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'

export const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'Invoice' },
  { id: 'customer', label: 'Customer' },
  { id: 'contact', label: 'Contact' },
  { id: 'totalLoan', label: 'Total\u00a0Loan' },
  { id: 'totalPaid', label: 'Total\u00a0Paid' },
  { id: 'totalRemain', label: 'Total\u00a0Remain' },
  { id: 'dueDate', label: 'Due\u00a0Date' },
  { id: 'action', label: 'ACTION', align: 'right' },
]

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
          <DeleteRoundedIcon fontSize='small' />
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
    totalPaid: currencyFormat(data.totalPaid.total, 'USD'),
    totalRemain: currencyFormat(data.totalRemain.USD, 'USD'),
    dueDate: dateFormat(null),
    action,
  }
}
