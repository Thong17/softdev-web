import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button } from '@mui/material'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectListUser, getListUser } from './redux'
import { ReactElement, useEffect, useState } from 'react'
import { UpdateButton, DeleteButton, ViewButton } from 'components/shared/table/ActionButton'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'

declare type ColumnHeader = 'name' | 'description' | 'createdBy' | 'action'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'createdBy', label: 'Created\u00a0By', align: 'right' },
  { id: 'action', label: 'Action', align: 'right' },
]
interface Data {
  id: string,
  username: string
  role: string
  email: string
  createdBy: string
  action: ReactElement
}

const createData = (
  id: string,
  username: string,
  role: string,
  createdBy: string,
  email: any,
  privilege: any,
  navigate: Function,
  setDialog: Function
): Data => {
let action = <div style={{ float: 'right' }}>
  { privilege?.user?.update && <UpdateButton onClick={() => navigate(`/admin/user/update/${id}`)} /> }
  { privilege?.user?.delete && <DeleteButton onClick={() => setDialog({ open: true, id })} /> }
  { privilege?.user?.detail && <ViewButton onClick={() => navigate(`/admin/user/detail/${id}`)} /> }
</div>
 
return { id, username, role, email, createdBy, action }
}

export const Users = () => {
  const dispatch = useAppDispatch()
  const { data: users, status } = useAppSelector(selectListUser)
  const { lang } = useLanguage()
  const { user } = useAuth()
  const { loadify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='user' title='Table' />
        <Button onClick={() => navigate('/admin/user/create')}>Create</Button>
      </>
    )
  }

  const handleConfirm = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/admin/user/disable/${id}`,
    })
    loadify(response)
    response.then(() => setRowData(rowData.filter((role) => role.id !== id)))
    
    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    dispatch(getListUser())
  }, [dispatch])

  useEffect(() => {
    const list = users.map((data: any) => {
      return createData(data._id, data.username, data.role || '...', data.email || '...', data.createdBy || '...', user?.privilege, navigate, setDialog)
    })
    setRowData(list)
  }, [users, lang, user, navigate])

  return (
    <Container header={<Header />}>
      <AlertDialog id={dialog.id} isOpen={dialog.open} handleConfirm={handleConfirm} handleClose={() => setDialog({ open: false, id: null })}></AlertDialog>
      {status === 'SUCCESS' && <StickyTable columns={columnData} rows={rowData} />}
    </Container>
  )
}

export { CreateUser } from './Create'
export { UpdateUser } from './Update'
export { DetailUser } from './Detail'
