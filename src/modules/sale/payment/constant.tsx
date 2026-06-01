import { IconButton } from '@mui/material'
import { MergeButton } from 'components/shared/table/ActionButton'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { TextHighlight } from 'components/shared/TextHighlight'
import moment from 'moment'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded'

export const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'INVOICE' },
  { id: 'subtotal', label: 'SUBTOTAL' },
  { id: 'discount', label: 'DISCOUNT' },
  { id: 'tax', label: 'TAX' },
  { id: 'voucher', label: 'VOUCHER' },
  { id: 'total', label: 'TOTAL' },
  { id: 'status', label: 'STATUS' },
  { id: 'table', label: 'TABLE' },
  { id: 'createdAt', label: 'CREATED_AT' },
  { id: 'createdBy', label: 'CREATED_BY' },
  { id: 'action', label: 'ACTION', align: 'center' },
]
export interface Data {
  id: string
  invoice: string
  type: string
  subtotal: any
  discount: any
  tax: any
  voucher: any
  total: any,
  status: any,
  table: any,
  createdAt: any,
  createdBy: any,
  action: any
}

export const createData = (
  id: string,
  invoice: string,
  type: string,
  subtotal: any,
  voucher: any,
  discount: any,
  tax: any,
  total: any,
  status: string,
  table: string,
  createdAt: any,
  createdBy: any,
  onView: Function | null,
  theme,
  privilege?: any,
  onMerge?: Function | null,
  listPaymentSelected?: string[]
): Data => {
  const action = onView ? <div style={{ display: 'flex', gap: '5px', justifyContent: 'end' }}>
    {(privilege?.payment?.merge && onMerge) && (
      <MergeButton isOn={listPaymentSelected?.includes(id)} onClick={(e) => {
        e.stopPropagation()
        onMerge(id)
      }} />
    )}
    <IconButton
      size='small'
      onClick={(e) => {
        e.stopPropagation()
        onView(id)
      }}
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        color: theme.color.info,
      }}
    >
      <AttachMoneyRoundedIcon fontSize='small' />
    </IconButton>
    <IconButton
      size='small'
      onClick={(e) => {
        e.stopPropagation()
        onView(id, 'detail')
      }}
      style={{
        backgroundColor: `${theme.color.success}22`,
        borderRadius: theme.radius.primary,
        color: theme.color.success,
      }}
    >
      <PointOfSaleRoundedIcon fontSize='small' />
    </IconButton>
  </div> : <></>
  return {
    id,
    invoice,
    type,
    subtotal,
    discount,
    tax,
    voucher,
    total: <TextHighlight text={total} color={theme.color.success} size={14} />,
    status: <TextHighlight text={status} color={status === 'COMPLETED' ? theme.color.success : theme.color.warning} />,
    table: <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><TableBarRoundedIcon fontSize='small' style={{ color: table === '--' ? theme.color.error : theme.color.info }} />{table}</div>,
    createdAt: moment(createdAt).fromNow(),
    createdBy,
    action
  }
}
