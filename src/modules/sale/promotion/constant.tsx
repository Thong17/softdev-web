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
import { dateFormat } from 'utils'
import { PromotionStatus } from 'components/shared/PromotionStatus'
import { PromotionLabel } from 'components/shared/PromotionLabel'

export declare type ColumnHeader =
  | 'no'
  | 'description'
  | 'value'
  | 'startAt'
  | 'expireAt'
  | 'products'
  | 'status'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'value', label: 'PROMOTION' },
  { id: 'startAt', label: 'START_AT' },
  { id: 'expireAt', label: 'EXPIRE_AT' },
  { id: 'status', label: 'STATUS' },
  { id: 'products', label: 'QUANTITY' },
  { id: 'action', label: 'ACTION', align: 'center' },
]
export interface Data {
  description: string
  value: ReactElement
  status: ReactElement
  startAt: string
  expireAt: string
  products: number
  createdBy: string
  action: ReactElement
}

export const importColumns = ['_id', 'name', 'description', 'status', 'icon']

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
    label: 'description',
    key: 'description',
  },
  {
    label: 'status',
    key: 'status',
  },
  {
    label: 'icon',
    key: 'icon',
  },
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'description', label: 'Description' },
  { id: 'value', label: 'Promotion' },
  { id: 'startAt', label: 'Start\u00a0At' },
  { id: 'expireAt', label: 'Expire\u00a0At' },
  { id: 'products', label: 'Items' },
  { id: 'createdBy', label: 'Created\u00a0By' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Remove' },
]

export const createData = (
  id: string,
  description: string,
  value: string,
  type: string,
  isFixed: boolean,
  startAt: string,
  expireAt: string,
  products: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.promotion?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/sale/promotion/update/${id}`)}
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
              onClick={() => navigate(`/sale/promotion/detail/${id}`)}
            >
              View
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.promotion?.update && (
            <UpdateButton
              onClick={() => navigate(`/sale/promotion/update/${id}`)}
            />
          )}
          {privilege?.promotion?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  const promotionValue = <PromotionLabel value={value} type={type} isFixed={isFixed} />
  const promotionStatus = <PromotionStatus start={new Date(startAt)} expire={new Date(expireAt)} />

  return { description, value: promotionValue, status: promotionStatus, startAt: dateFormat(startAt), expireAt: dateFormat(expireAt), createdBy, products: products.length, action }
}
