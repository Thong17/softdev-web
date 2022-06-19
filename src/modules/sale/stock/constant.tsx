import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import {
  StockButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { MenuList } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { currencyFormat } from 'utils'

export interface IStockBody {
  cost: number,
  currency: string,
  quantity: number,
  code?: string,
  expireAt?: Date,
  alertAt: number,
  color?: string,
  option?: string,
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

export const importColumns = ['_id', 'name', 'price', 'currency', 'code', 'isStock', 'brand', 'category', 'description', 'status', 'profile', 'images']

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
  name: string,
  stock: string,
  price: ReactElement,
  currency: string,
  code: string | null,
  description: string,
  isStock: boolean,
  profile: string,
  brand: string,
  category: string,
  createdBy: string
  status: boolean
  action: ReactElement
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

  return { id, profile, name, stock: `${stock} Left`, price: currencyFormat(price, currency), currency, code, isStock, brand, category, description, createdBy, status, action }
}


