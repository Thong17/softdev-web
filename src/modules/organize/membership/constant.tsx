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
  | 'name'
  | 'discounts'
  | 'target'
  | 'status'
  | 'startAt'
  | 'expireAt'
  | 'note'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'NAME' },
  { id: 'discounts', label: 'DISCOUNT' },
  { id: 'target', label: 'TARGET' },
  { id: 'status', label: 'STATUS' },
  { id: 'startAt', label: 'START_AT' },
  { id: 'expireAt', label: 'EXPIRE_AT' },
  { id: 'note', label: 'NOTE' },
  { id: 'createdBy', label: 'CREATED_BY' },
  { id: 'action', label: 'ACTION', align: 'center' },
]

export interface Data {
  name: string
  discounts: ReactElement
  target: string
  status: ReactElement
  startAt: string
  expireAt: string
  note: string
  createdBy: string
  action: ReactElement
}

export const initState = {
  description: {},
  discounts: {
    value: 0,
    type: 'PCT',
    isFixed: false
  },
  target: {
    type: 'product',
    products: [],
    categories: [],
    brands: []
  },
  duration: {
    value: 1,
    unit: 'month'
  },
  note: '',
  startAt: '',
  expireAt: ''
}

export const createData = (
  id: string,
  name: string,
  discounts: { value: number, type: string, isFixed: boolean },
  target: { type: string },
  startAt: string,
  expireAt: string,
  note: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.membership?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/membership/update/${id}`)}
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
              onClick={() => navigate(`/organize/membership/detail/${id}`)}
            >
              View
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.membership?.update && (
            <UpdateButton
              onClick={() => navigate(`/organize/membership/update/${id}`)}
            />
          )}
          {privilege?.membership?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  const discountValue = discounts?.value || 0
  const discountType = discounts?.type || 'PCT'
  const discountLabel = <PromotionLabel value={discountValue} type={discountType} isFixed={discounts?.isFixed} />
  const status = <PromotionStatus start={new Date(startAt)} expire={new Date(expireAt)} />

  return { 
    name, 
    discounts: discountLabel, 
    target: target?.type || '...',
    status, 
    startAt: dateFormat(startAt), 
    expireAt: dateFormat(expireAt), 
    note: note || '...',
    createdBy, 
    action 
  }
}