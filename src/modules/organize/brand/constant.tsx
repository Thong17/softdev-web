import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import {
  DeleteButton,
  UpdateButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { MenuList } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { CircleIcon } from 'components/shared/table/CustomIcon'

export declare type ColumnHeader =
  | 'no'
  | 'icon'
  | 'name'
  | 'status'
  | 'description'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'icon', label: 'Icon' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'createdBy', label: 'Created\u00a0By' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action', align: 'center' },
]
export interface Data {
  id: string
  icon: ReactElement
  name: string
  description: string
  createdBy: string
  status: boolean
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
  { id: 'no', label: 'No' },
  { id: 'icon', label: 'Icon' },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Remove', align: 'right' },
]

export const createData = (
  id: string,
  icon: string,
  name: string,
  description: string,
  createdBy: string,
  status: boolean,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.brand?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/organize/brand/update/${id}`)}
            >
              Edit
            </MenuList>
            <MenuList
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuList>
            <MenuList
              component='div'
              onClick={() => navigate(`/organize/brand/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.brand?.update && (
            <UpdateButton
              onClick={() => navigate(`/organize/brand/update/${id}`)}
            />
          )}
          {privilege?.brand?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, icon: <CircleIcon icon={icon} />, name, description, createdBy, status, action }
}
