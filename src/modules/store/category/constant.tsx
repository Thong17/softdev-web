import { ITableColumn } from 'components/shared/table/StickyTable'
import React, { ReactElement } from 'react'
import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import { DeleteButton, UpdateButton, ViewButton } from 'components/shared/table/ActionButton'
import { MenuList } from '@mui/material'
import { IThemeStyle } from 'contexts/theme/interface'

export declare type ColumnHeader = 'icon' | 'name' | 'status' | 'description' | 'createdBy' | 'action'

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
  icon: string
  name: string
  description: string
  createdBy: string
  status: ReactElement
  action: ReactElement
}
export const importColumns = ['_id', 'name', 'description', 'status']

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
]

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
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
  theme: IThemeStyle,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: "right" }}>
      {device === "mobile" ? (
        privilege?.category?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/store/category/update/${id}`)}
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
              onClick={() => navigate(`/store/category/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.category?.update && (
            <UpdateButton
              onClick={() => navigate(`/store/category/update/${id}`)}
            />
          )}
          {privilege?.category?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  const categoryStatus = status ? <span style={{ color: theme.color.success }}>Enabled</span> : <span style={{ color: theme.color.error }}>Disabled</span>

  return { id, icon, name, description, createdBy, status: categoryStatus, action }
}