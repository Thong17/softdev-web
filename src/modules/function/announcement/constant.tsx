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
import { CircleIcon } from 'components/shared/table/CustomIcon'

export declare type ColumnHeader =
  | 'no'
  | 'banner'
  | 'title'
  | 'startAt'
  | 'expireAt'
  | 'order'
  | 'status'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'banner', label: 'BANNER' },
  { id: 'title', label: 'TITLE' },
  { id: 'startAt', label: 'START_AT' },
  { id: 'expireAt', label: 'EXPIRE_AT' },
  { id: 'order', label: 'ORDER' },
  { id: 'status', label: 'STATUS' },
  { id: 'action', label: 'ACTION', align: 'center' },
]
export interface Data {
  id: string
  banner: ReactElement
  title: string
  startAt: string
  expireAt: string
  order: number
  status: boolean
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  banner: string,
  title: string,
  startAt: string,
  expireAt: string,
  order: number,
  status: boolean,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.banner?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/function/banner/update/${id}`)}
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
              onClick={() => navigate(`/function/banner/detail/${id}`)}
            >
              View
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.banner?.update && (
            <UpdateButton
              onClick={() => navigate(`/function/banner/update/${id}`)}
            />
          )}
          {privilege?.banner?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, banner: <CircleIcon icon={banner} radius={10} width={50} height={30} />, title, startAt: dateFormat(startAt), expireAt: dateFormat(expireAt), order, status, createdBy, action }
}
