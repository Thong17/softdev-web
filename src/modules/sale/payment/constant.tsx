import { IconButton } from '@mui/material'
import { MergeButton } from 'components/shared/table/ActionButton'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { TextHighlight } from 'components/shared/TextHighlight'
import moment from 'moment'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'

export const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'INVOICE' },
  { id: 'type', label: 'TYPE' },
  { id: 'subtotal', label: 'SUBTOTAL' },
  { id: 'discount', label: 'DISCOUNT' },
  { id: 'tax', label: 'TAX' },
  { id: 'voucher', label: 'VOUCHER' },
  { id: 'total', label: 'TOTAL' },
  { id: 'status', label: 'STATUS' },
  { id: 'table', label: 'TABLE' },
  {id: 'createdAt', label: 'CREATED\u00a0AT' },
  { id: 'createdBy', label: 'Created\u00a0By' },
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
  onPrint: Function | null,
  theme,
  privilege?: any,
  onMerge?: Function | null,
  listPaymentSelected?: string[]
): Data => {
  const action = onPrint ? <div style={{ display: 'flex', gap: '5px', justifyContent: 'end' }}>
    {(privilege?.payment?.update && onMerge) && (
      <MergeButton isOn={listPaymentSelected?.includes(id)} onClick={(e) => {
        e.stopPropagation()
        onMerge(id)
      }} />
    )}
    <IconButton
      size='small'
      onClick={(e) => {
        e.stopPropagation()
        onPrint(id)
      }}
      style={{
        backgroundColor: `${theme.color.success}22`,
        borderRadius: theme.radius.primary,
        color: theme.color.success,
      }}
    >
      <AttachMoneyRoundedIcon fontSize='small' />
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
    total,
    status: <TextHighlight text={status} color={status === 'COMPLETED' ? theme.color.success : theme.color.warning} />,
    table,
    createdAt: moment(createdAt).format('DD/MM/YYYY HH:mm'),
    createdBy,
    action
  }
}
