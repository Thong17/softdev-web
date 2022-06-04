import { DeviceOptions } from 'contexts/web/interface'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { MenuList } from '@mui/material'
import {
  UpdateButton,
  DeleteButton,
  ViewButton,
} from 'components/shared/table/ActionButton'
import { MenuDialog } from 'components/shared/MenuDialog'
import AdminBreadcrumbs from '../components/Breadcrumbs'
import { SearchField } from 'components/shared/table/SearchField'
import { FilterButton } from 'components/shared/table/FilterButton'
import { OptionButton } from 'components/shared/table/OptionButton'
import { CustomButton } from 'styles'

export interface IUserBody {
  username: string,
  password: string,
  email: string,
  role: string,
}

export const initState: IUserBody = {
  username: '',
  password: '',
  email: '',
  role: ''
}

export declare type ColumnHeader =
  | 'no'
  | 'username'
  | 'description'
  | 'createdBy'
  | 'role'
  | 'email'
  | 'action'
  | 'status'

export const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'username', label: 'Username' },
  { id: 'role', label: 'Role' },
  { id: 'email', label: 'Email' },
  { id: 'description', label: 'Description' },
  { id: 'createdBy', label: 'Created\u00a0By', align: 'right' },
  { id: 'action', label: 'Action', align: 'right' },
]

export interface Data {
  id: string
  username: string
  role: string
  email: string
  description: string
  createdBy: string
  action: ReactElement
}

export const createData = (
  id: string,
  username: string,
  role: string,
  email: any,
  description: string,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  navigate: Function,
  setDialog: Function
): Data => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.role?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuList
              component='div'
              onClick={() => navigate(`/admin/user/update/${id}`)}
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
              onClick={() => navigate(`/admin/user/detail/${id}`)}
            >
              View
            </MenuList>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.role?.update && (
            <UpdateButton
              onClick={() => navigate(`/admin/user/update/${id}`)}
            />
          )}
          {privilege?.role?.delete && (
            <DeleteButton onClick={() => setDialog({ open: true, id })} />
          )}
        </>
      )}
    </div>
  )
  return { id, username, role, email, description, createdBy, action }
}

export const Header = ({ styled, navigate, handleSearch, handleImport }) => {
  return (
    <>
      <AdminBreadcrumbs page='user' title='Table' />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchField onChange={handleSearch} />
        <FilterButton style={{ marginLeft: 10 }}>
          <MenuList>Sort By Name</MenuList>
          <MenuList>Sort By Date</MenuList>
        </FilterButton>
        <OptionButton style={{ marginLeft: 10 }}>
          <MenuList>
            <label htmlFor='file-upload' style={{ cursor: 'pointer' }}>
              Import Data
            </label>
            <input
              id='file-upload'
              type='file'
              onChange={handleImport}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </MenuList>
          <MenuList>Export Data</MenuList>
          <MenuList>Download Template</MenuList>
        </OptionButton>
        <CustomButton
          style={{
            marginLeft: 10,
            backgroundColor: styled.background.secondary,
            color: styled.text.secondary,
          }}
          styled={styled}
          onClick={() => navigate('/admin/user/create')}
        >
          Create
        </CustomButton>
      </div>
    </>
  )
}

export const importColumns = ['username', 'role', 'email', 'description']

export const importColumnData: ITableColumn<ColumnHeader>[] = [
  { id: 'no', label: 'No' },
  { id: 'username', label: 'Username', minWidth: 100 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 150 },
  { id: 'description', label: 'Description', minWidth: 190 },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' },
]