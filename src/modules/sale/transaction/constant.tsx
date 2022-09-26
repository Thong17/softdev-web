import {
  ResetButton,
} from 'components/shared/table/ActionButton'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { currencyFormat } from 'utils'
import { TextHighlight } from 'components/shared/TextHighlight'
import { IThemeStyle } from 'contexts/theme/interface'

export const columnData: ITableColumn<any>[] = [
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'price', label: 'PRICE' },
  { id: 'quantity', label: 'QUANTITY' },
  { id: 'discount', label: 'DISCOUNT' },
  { id: 'total', label: 'TOTAL' },
  { id: 'status', label: 'STATUS' },
  { id: 'note', label: 'NOTE' },
  { id: 'createdBy', label: 'CREATED_BY' },
  { id: 'action', label: 'ACTION', align: 'center' },
]
export interface Data {
  description: string
  price: any
  quantity: any
  status: any
  discount: any
  total: any
  note: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  description: string,
  price: number,
  currency: string,
  quantity: number,
  discount: any,
  total: any,
  status: string,
  note: string,
  createdBy: string,
  privilege: any,
  theme: IThemeStyle,
  onReverse: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {(privilege?.transaction?.delete && !status) && (
        <ResetButton onClick={() => onReverse(id)} />
      )}
    </div>
  )

  return {
    description,
    quantity,
    price: currencyFormat(price, currency),
    discount: <div><span>{discount.isFixed ? 'Only ' : ''}</span><span>{currencyFormat(discount.value, discount.type)}</span></div>,
    total: currencyFormat(total.value, total.currency),
    status: <TextHighlight text={status ? 'Completed' : 'Pending'} color={status ? theme.color.success : theme.color.warning} />,
    note,
    createdBy,
    action,
  }
}
