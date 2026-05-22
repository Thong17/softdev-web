import { ViewButton } from 'components/shared/table/ActionButton'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { TextHighlight } from 'components/shared/TextHighlight'
import moment from 'moment'

export const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'INVOICE' },
  { id: 'type', label: 'TYPE' },
  { id: 'subtotal', label: 'SUBTOTAL' },
  { id: 'discount', label: 'DISCOUNT' },
  { id: 'tax', label: 'TAX' },
  { id: 'voucher', label: 'VOUCHER' },
  { id: 'total', label: 'TOTAL' },
  { id: 'status', label: 'STATUS' },
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
  status: String,
  createdAt: any,
  createdBy: any,
  onPrint: Function | null,
  theme
): Data => {
  const action = onPrint ? <div style={{ float: 'right' }}>
    <ViewButton onClick={() => onPrint(id)} />
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
    createdAt: moment(createdAt).format('DD/MM/YYYY HH:mm'),
    createdBy,
    action
  }
}
