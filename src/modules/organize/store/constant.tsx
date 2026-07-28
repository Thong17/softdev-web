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
  | 'type'
  | 'contact'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'icon', label: 'Icon' },
  { id: 'name', label: 'Name' },
  { id: 'type', label: 'Type' },
  { id: 'contact', label: 'Contact' },
  { id: 'createdBy', label: 'Created\u00a0By' },
  { id: 'action', label: 'Action', align: 'center' },
]
export interface Data {
  id: string
  icon: ReactElement
  name: string
  type: string
  contact: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  icon: string,
  name: string,
  type: string,
  contact: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        <MenuDialog label={<ViewButton />}>
          {privilege?.store?.update && (
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/store/update/${id}`)}
            >
              Edit
            </MenuItem>
          )}
          {privilege?.store?.delete && (
            <MenuItem
              component='div'
              onClick={() => setDialog({ open: true, id })}
            >
              Delete
            </MenuItem>
          )}
          {privilege?.store?.detail && (
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/store/detail/${id}`)}
            >
              View
            </MenuItem>
          )}
        </MenuDialog>
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

  return { id, icon: <CircleIcon icon={icon} />, name, type, contact, createdBy, action }
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

