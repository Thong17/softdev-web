import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import {
  DeleteButton,
  UpdateButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { MenuItem } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { currencyFormat } from 'utils'

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

export const productColumns = [
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
  'colors',
  'properties',
  'options',
]
export const detailColumns = [
  '_id',
  'size',
  'width',
  'height',
  'depth',
  'weight',
  'shape',
  'material',
  'style',
  'product',
]
export const imageColumns = ['_id', 'filename', 'isActive']
export const colorColumns = [
  '_id',
  'name',
  'price',
  'currency',
  'profile',
  'images',
  'product',
]
export const propertyColumns = ['_id', 'name', 'description', 'product']
export const optionColumns = [
  '_id',
  'name',
  'price',
  'currency',
  'profile',
  'description',
  'property',
  'product',
]

export const productHeaderColumns = [
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
    label: 'detail',
    key: 'detail',
  },
  {
    label: 'images',
    key: 'images',
  },
  {
    label: 'options',
    key: 'options',
  },
  {
    label: 'properties',
    key: 'properties',
  },
  {
    label: 'colors',
    key: 'colors',
  },
]

export const detailHeaderColumns = [
  {
    label: '_id',
    key: '_id',
  },
  {
    label: 'size',
    key: 'size',
  },
  {
    label: 'width',
    key: 'width',
  },
  {
    label: 'height',
    key: 'height',
  },
  {
    label: 'depth',
    key: 'depth',
  },
  {
    label: 'weight',
    key: 'weight',
  },
  {
    label: 'shape',
    key: 'shape',
  },
  {
    label: 'material',
    key: 'material',
  },
  {
    label: 'style',
    key: 'style',
  },
  {
    label: 'product',
    key: 'product',
  },
]

export const colorHeaderColumns = [
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
    label: 'profile',
    key: 'profile',
  },
  {
    label: 'images',
    key: 'images',
  },
  {
    label: 'product',
    key: 'product',
  },
]

export const optionHeaderColumns = [
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
    label: 'profile',
    key: 'profile',
  },
  {
    label: 'description',
    key: 'description',
  },
  {
    label: 'property',
    key: 'property',
  },
  {
    label: 'product',
    key: 'product',
  },
]

export const propertyHeaderColumns = [
  {
    label: '_id',
    key: '_id',
  },
  {
    label: 'name',
    key: 'name',
  },
  {
    label: 'description',
    key: 'description',
  },
  {
    label: 'product',
    key: 'product',
  },
]

export const imageHeaderColumns = [
  {
    label: '_id',
    key: '_id',
  },
  {
    label: 'filename',
    key: 'filename',
  },
  {
    label: 'isActive',
    key: 'isActive',
  },
]

export const productColumnData: ITableColumn<ColumnHeader>[] = [
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
  { id: 'action', label: 'Remove', align: 'right' },
]

export const detailColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'No' },
  { id: 'size', label: 'Size' },
  { id: 'width', label: 'Width' },
  { id: 'height', label: 'Height' },
  { id: 'depth', label: 'Depth' },
  { id: 'weight', label: 'Weight' },
  { id: 'shape', label: 'Shape' },
  { id: 'material', label: 'Material' },
  { id: 'style', label: 'Style' },
  { id: 'product', label: 'Product' },
  { id: 'action', label: 'Remove', align: 'right' },
]

export const colorColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'No' },
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'currency', label: 'Currency' },
  { id: 'profile', label: 'Profile' },
  { id: 'images', label: 'Images' },
  { id: 'product', label: 'Product' },
  { id: 'action', label: 'Remove', align: 'right' },
]

export const imageColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'No' },
  { id: 'filename', label: 'Filename' },
  { id: 'isActive', label: 'IsActive' },
  { id: 'action', label: 'Remove' },
]

export const propertyColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'No' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'product', label: 'Product' },
  { id: 'action', label: 'Remove', align: 'right' },
]

export const optionColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'No' },
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'currency', label: 'Currency' },
  { id: 'profile', label: 'Profile' },
  { id: 'description', label: 'Description' },
  { id: 'property', label: 'Property' },
  { id: 'product', label: 'Product' },
  { id: 'action', label: 'Remove', align: 'right' },
]

export interface Data {
  id: string
  name: string
  tags: string
  priceTag: ReactElement
  price: number
  currency: string
  code: string | null
  description: string
  isStock: boolean
  profile: string
  brand: string
  category: string
  createdBy: string
  createdAt: string
  status: boolean
  action: ReactElement
}

export const createData = (
  id: string,
  profile: string,
  name: string,
  tags: string,
  price: number,
  currency: string,
  code: string | null,
  isStock: boolean,
  brand: string,
  category: string,
  description: string,
  createdBy: string,
  createdAt: string,
  status: boolean,
  privilege: any,
  rate: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <>
      {device === 'mobile' ? (
        privilege?.product?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/product/update/${id}`)}
            >
              Edit
            </MenuItem>
            <MenuItem
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuItem>
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/product/detail/${id}`)}
            >
              View
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.product?.update && (
            <UpdateButton
              style={{ margin: 0 }}
              onClick={() => navigate(`/organize/product/update/${id}`)}
            />
          )}
          {privilege?.product?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </>
  )
  const buyRate = rate || 4000
  return {
    id,
    profile,
    name,
    tags,
    priceTag: currencyFormat(price, currency),
    price: currency === 'USD' ? price : price / buyRate,
    currency,
    code,
    isStock,
    brand,
    category,
    description,
    createdBy,
    createdAt,
    status,
    action,
  }
}
