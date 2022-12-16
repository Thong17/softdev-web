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
import { languages } from 'contexts/language/constant'

export const productImportColumns = ['ID', Object.keys(languages).map(lang => `NAME_${lang}`.toUpperCase()), 'PRICE', 'CURRENCY', 'CODE', 'IS_STOCK', 'DESCRIPTION', 'STATUS', 'TAGS', 'BRAND_ID', 'CATEGORY_ID']

export const productColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'ID' },
  ...Object.keys(languages).map(lang => ({ id: `name${lang}`, label: `${lang}` })),
  { id: 'price', label: 'Price' },
  { id: 'currency', label: 'Currency' },
  { id: 'code', label: 'Code' },
  { id: 'isStock', label: 'Is Stock', minWidth: 70 },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: 'brand', label: 'Brand' },
  { id: 'category', label: 'Category' },
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
