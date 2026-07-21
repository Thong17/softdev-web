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

export declare type ColumnHeader =
  | 'no'
  | 'icon'
  | 'name'
  | 'legalName'
  | 'contact'
  | 'email'
  | 'status'
  | 'createdBy'
  | 'action'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'icon', label: 'LOGO' },
  { id: 'name', label: 'NAME' },
  { id: 'legalName', label: 'LEGAL_NAME' },
  { id: 'contact', label: 'CONTACT' },
  { id: 'email', label: 'EMAIL' },
  { id: 'status', label: 'STATUS' },
  { id: 'action', label: 'ACTION', align: 'center' },
]
export interface Data {
  id: string
  icon: ReactElement
  name: string
  legalName: string
  contact: string
  email: string
  createdBy: string
  status: boolean
  action: ReactElement
}

export const createData = (
  id: string,
  icon: string,
  name: string,
  legalName: string,
  contact: string,
  email: string,
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
        privilege?.company?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/organize/company/update/${id}`)}
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
              onClick={() => navigate(`/organize/company/detail/${id}`)}
            >
              View
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.company?.update && (
            <UpdateButton
              onClick={() => navigate(`/organize/company/update/${id}`)}
            />
          )}
          {privilege?.company?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )

  return { id, icon: <CircleIcon icon={icon} />, name, legalName, contact, email, createdBy, status, action }
}
