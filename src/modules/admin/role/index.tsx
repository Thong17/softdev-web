import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { Button } from '@mui/material'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectListRole, getListRole } from './redux'
import { ReactElement, useEffect, useState } from 'react'
import { UpdateButton, DeleteButton, ViewButton } from 'components/shared/table/ActionButton'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'

declare type ColumnHeader = 'name' | 'description' | 'createdBy' | 'action'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'createdBy', label: 'Created\u00a0By', align: 'right' },
  { id: 'action', label: 'Action', align: 'right' },
]
interface Data {
  name: string
  description: string
  createdBy: string
  action: ReactElement
}

const createData = (
  id: string,
  name: string,
  description: string,
  createdBy: string,
  privilege: any,
  navigate: Function
): Data => {
let action = <div style={{ float: 'right' }}>
  { privilege?.role?.update && <UpdateButton onClick={() => navigate(`/admin/role/update/${id}`)} /> }
  { privilege?.role?.delete && <DeleteButton /> }
  { privilege?.role?.detail && <ViewButton onClick={() => navigate(`/admin/role/${id}`)} /> }
</div>
 
return { name, description, createdBy, action: action }
}

export const Role = () => {
  const dispatch = useAppDispatch()
  const { data: roles, status } = useAppSelector(selectListRole)
  const { lang } = useLanguage()
  const { user } = useAuth()
  const [rowData, setRowData] = useState<Data[]>([])
  const navigate = useNavigate()
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='role' title='Table' />
        <Button onClick={() => navigate('/admin/role/create')}>Create</Button>
      </>
    )
  }

  useEffect(() => {
    dispatch(getListRole())
  }, [dispatch])

  useEffect(() => {
    const listRoles = roles.map((role: any) => {
      return createData(role._id, role.name?.[lang] || role.name?.['English'], role.description || '...', role.createdBy || '...', user?.privilege, navigate)
    })
    setRowData(listRoles)
  }, [roles, lang, user, navigate])

  return (
    <Container header={<Header />}>
      <StickyTable columns={columnData} rows={rowData} loading={ status === 'LOADING' ? true : false } />
    </Container>
  )
}
