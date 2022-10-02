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
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { IOptions } from 'components/shared/form/SelectField'

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
  { id: 'action', label: 'Remove' },
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
        privilege?.store?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/store/update/${id}`)}
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
              onClick={() => navigate(`/organize/store/detail/${id}`)}
            >
              View
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.store?.update && (
            <UpdateButton
              onClick={() => navigate(`/organize/store/update/${id}`)}
            />
          )}
          {privilege?.store?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, icon: <CircleIcon icon={icon} />, name, description, createdBy, status, action }
}

export const sizeOptions: IOptions[] = [
  {
    value: 'small',
    label: 'Small',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'large',
    label: 'Large',
  },
]

export const positionOptions: IOptions[] = [
  {
    value: 'start',
    label: 'Start',
  },
  {
    value: 'center',
    label: 'Center',
  },
  {
    value: 'end',
    label: 'End',
  },
]

export const directionOptions: IOptions[] = [
  {
    value: 'row',
    label: 'Row',
  },
  {
    value: 'column',
    label: 'Column',
  },
]

export const typeOptions: IOptions[] = [
  {
    value: 'table',
    label: 'Table',
  },
  {
    value: 'room',
    label: 'Room',
  },
]

