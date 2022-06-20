import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import {
  StockButton,
  ViewButton,
  DeleteButton,
  UpdateButton,
} from 'components/shared/table/ActionButton'
import { IconButton, MenuList } from '@mui/material'
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

export declare type ColumnHeader =
  | 'no'
  | 'images'
  | 'profile'
  | 'price'
  | 'currency'
  | 'code'
  | 'isStock'
  | 'brand'
  | 'category'
  | 'profile'
  | 'name'
  | 'status'
  | 'description'
  | 'createdBy'
  | 'action'

export const importColumns = [
  '_id',
  'name',
  'price',
  'currency',
  'code',
  'isStock',
  'brand',
  'category',
  'description',
  'status',
  'profile',
  'images',
]

export const headerColumns = [
  {
    label: '_id',
    key: '_id',
  },
  {
    label: 'name',
    key: 'name',
  },
  {
    label: 'price',
    key: 'price',
  },
  {
    label: 'currency',
    key: 'currency',
  },
  {
    label: 'code',
    key: 'code',
  },
  {
    label: 'isStock',
    key: 'isStock',
  },
  {
    label: 'brand',
    key: 'brand',
  },
  {
    label: 'category',
    key: 'category',
  },
  {
    label: 'description',
    key: 'description',
  },
  {
    label: 'status',
    key: 'status',
  },
  {
    label: 'profile',
    key: 'profile',
  },
  {
    label: 'images',
    key: 'images',
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'No' },
  { id: 'profile', label: 'Profile' },
  { id: 'images', label: 'Images' },
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'currency', label: 'Currency' },
  { id: 'code', label: 'Code' },
  { id: 'isStock', label: 'Is Stock', minWidth: 70 },
  { id: 'brand', label: 'Brand' },
  { id: 'category', label: 'Category' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
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
  // { id: 'alertAt', label: 'Alert\u00a0At' },
  // { id: 'color', label: 'Color' },
  // { id: 'option', label: 'Option' },
  // { id: 'expireAt', label: 'Expire\u00a0At' },
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

  let stock = 0

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
  onDeleteStock: Function
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
          {privilege?.brand?.detail && <IconButton><ViewButton /></IconButton>}
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
