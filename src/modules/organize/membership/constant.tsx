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
    0: {
      type: 'product',
      target: '',
      discountType: 'percentage',
      value: 0,
    },
  },
  note: '',
  startAt: '',
  expireAt: '',
  isActive: true,
}

export interface CreateDataProps {
  id: string
  name: string
  discounts: any
  target: any
  startAt: string
  expireAt: string
  note: string
  createdBy: any
  privilege: any
  device: DeviceOptions
  navigate: Function
  setDialog: Function
}

export const createData = ({
  id,
  name,
  discounts,
  target,
  startAt,
  expireAt,
  note,
  createdBy,
  privilege,
  device,
  navigate,
  setDialog,
}: CreateDataProps): Data => {
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

  const discountObject = (() => {
    if (!discounts) return null
    if (discounts.value !== undefined && discounts.type !== undefined) {
      return discounts
    }
    if (typeof discounts === 'object') {
      const keys = Object.keys(discounts)
      if (keys.length > 0) {
        const first = discounts[keys[0]]
        if (first && typeof first === 'object' && first.value !== undefined) {
          return first
        }
      }
    }
    return null
  })()

  const discountValue = discountObject?.value || 0
  const discountType = discountObject?.type || 'PCT'
  const discountLabel = (
    <PromotionLabel
      value={discountValue}
      type={discountType}
      isFixed={discountObject?.isFixed}
    />
  )

  const createdByLabel =
    (createdBy &&
      (createdBy.username ||
        createdBy.name ||
        (typeof createdBy._id === 'string' ? createdBy._id : null) ||
        (typeof createdBy === 'string' ? createdBy : null) ||
        '...')) ||
    '...'
  const status = <PromotionStatus start={new Date(startAt)} expire={new Date(expireAt)} />

  return {
    name,
    discounts: discountLabel,
    target: target,
    status,
    startAt: dateFormat(startAt),
    expireAt: dateFormat(expireAt),
    note: note || '...',
    createdBy: createdByLabel,
    action,
  }
}