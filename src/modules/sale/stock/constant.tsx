import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import {
  StockButton,
  ViewButton,
  DeleteButton,
  UpdateButton,
  DetailButton,
} from 'components/shared/table/ActionButton'
import { MenuList } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { currencyFormat, dateFormat } from 'utils'
import { ColorPlate } from 'components/shared/table/ColorPlate'
import { IThemeStyle } from 'contexts/theme/interface'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { inputDateFormat } from 'utils'

export interface IStockBody {
  cost: number
  currency: string
  quantity: number
  code?: string
  expireAt?: Date
  alertAt: number
  color?: string
  option?: string
  product: string
}

export const initStock = {}

export const importColumns = [
  '_id',
  'cost',
  'currency',
  'quantity',
  'remain',
  'code',
  'expireAt',
  'alertAt',
  'color',
  'options',
  'product',
]

export const headerColumns = [
  {
    label: '_id',
    key: '_id',
  },
  {
    label: 'cost',
    key: 'cost',
  },
  {
    label: 'currency',
    key: 'currency',
  },
  {
    label: 'quantity',
    key: 'quantity',
  },
  {
    label: 'remain',
    key: 'remain',
  },
  {
    label: 'code',
    key: 'code',
  },
  {
    label: 'expireAt',
    key: 'expireAt',
  },
  {
    label: 'alertAt',
    key: 'alertAt',
  },
  {
    label: 'color',
    key: 'color',
  },
  {
    label: 'options',
    key: 'options',
  },
  {
    label: 'product',
    key: 'product',
  },
]

export const importColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'No' },
  { id: 'cost', label: 'Cost' },
  { id: 'currency', label: 'Currency' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'remain', label: 'Remain' },
  { id: 'code', label: 'Code' },
  { id: 'expireAt', label: 'Expire\u00a0At' },
  { id: 'alertAt', label: 'Alert\u00a0At' },
  { id: 'color', label: 'Color' },
  { id: 'options', label: 'Options' },
  { id: 'product', label: 'Product' },
  { id: 'action', label: 'Remove' },
]

export interface Data {
  id: string
  name: string
  stock: string
  price: ReactElement
  currency: string
  code: string | null
  description: string
  isStock: boolean
  profile: string
  brand: string
  category: string
  createdBy: string
  status: boolean
  action: ReactElement
}

export declare type StockColumnHeader =
  | 'no'
  | 'cost'
  | 'currency'
  | 'quantity'
  | 'remain'
  | 'total'
  | 'code'
  | 'expireAt'
  | 'alertAt'
  | 'color'
  | 'option'
  | 'createdBy'
  | 'action'

export const stockColumnData: ITableColumn<StockColumnHeader>[] = [
  { id: 'cost', label: 'Cost' },
  { id: 'currency', label: 'Currency' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'remain', label: 'Remain' },
  { id: 'total', label: 'Total' },
  { id: 'action', label: 'Action', align: 'center' },
]

export const mapStockBody = (body) => {
  return {
    cost: body?.cost,
    currency: body?.currency,
    quantity: body?.quantity,
    code: body.code,
    expireAt: inputDateFormat(body?.expireAt),
    alertAt: body?.alertAt,
    color: body?.color,
    product: body?.product,
    options: body?.options,
  }
}

export const createData = (
  id: string,
  profile: string,
  name: string,
  stocks: Object[],
  price: number,
  currency: string,
  code: string | null,
  isStock: boolean,
  brand: string,
  category: string,
  description: string,
  createdBy: string,
  status: boolean,
  privilege: any,
  device: DeviceOptions,
  navigate: Function
): Data => {
  let action = (
    <>
      {device === 'mobile' ? (
        privilege?.product?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/sale/stock/item/${id}`)}
            >
              Stock
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.product?.update && (
            <StockButton
              style={{ margin: 0 }}
              onClick={() => navigate(`/sale/stock/item/${id}`)}
            />
          )}
        </>
      )}
    </>
  )

  let alertStocks: any[] = []

  let stock = 0
  stocks?.forEach((stk: any) => {
    stock += stk.quantity
    if (stk.quantity < stk.alertAt) {
      alertStocks.push(stk)
    }
  })

  return {
    id,
    profile,
    name,
    stock: `${stock} Left`,
    price: currencyFormat(price, currency),
    currency,
    code,
    isStock,
    brand,
    category,
    description,
    createdBy,
    status,
    action,
  }
}

export const createStockData = (
  id: string,
  cost: number,
  currency: string,
  quantity: number,
  remain: number,
  code: string | null,
  expireAt: Date,
  alertAt: number,
  color: string,
  options: Array<string>,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  theme: IThemeStyle,
  onEditStock: Function,
  onDeleteStock: Function,
  onViewStock: Function
) => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.brand?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList component='div'>Edit</MenuList>
            <MenuList component='div'>Delete</MenuList>
            <MenuList component='div'>View</MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.brand?.update && <UpdateButton onClick={() => onEditStock(id)} />}
          {privilege?.brand?.delete && <DeleteButton onClick={() => onDeleteStock(id)} />}
          {privilege?.brand?.detail && <DetailButton onClick={() => onViewStock(id)} />}
        </>
      )}
    </div>
  )

  let option = options.length ? (<MenuDialog
      label={<ArrowDropDownRoundedIcon />}
      style={{
        fontSize: theme.responsive[device].text.quaternary,
        color: theme.text.secondary,
      }}
    >
      {options.map((opt, index) => {
        return (
          <MenuList key={index} component='div'>
            {opt}
          </MenuList>
        )
      })}
    </MenuDialog>) : null
  
  return {
    id,
    cost: currencyFormat(cost, currency),
    currency,
    quantity,
    remain,
    total: currencyFormat(cost * quantity, currency),
    code,
    expireAt: dateFormat(expireAt),
    alertAt,
    color: <ColorPlate color={color} />,
    option,
    createdBy,
    action,
  }
}
