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
import { languages } from 'contexts/language/constant'

export declare type ColumnHeader =
  | 'no'
  | 'icon'
  | 'name'
  | 'status'
  | 'description'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'icon', label: 'ICON' },
  { id: 'name', label: 'NAME' },
  { id: 'description', label: 'DESCRIPTION' },
  { id: 'status', label: 'STATUS' },
  { id: 'action', label: 'ACTION', align: 'center' },
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

export const importColumns = ['ID', Object.keys(languages).map(lang => `NAME_${lang}`.toUpperCase()), 'DESCRIPTION', 'STATUS', 'TAGS']

export const importColumnData: ITableColumn<any>[] = [
  { id: 'no', label: 'ID' },
  ...Object.keys(languages).map(lang => ({ id: `name${lang}`, label: `${lang}` })),
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
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/brand/update/${id}`)}
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
              onClick={() => navigate(`/organize/brand/detail/${id}`)}
            >
              View
            </MenuItem>
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
