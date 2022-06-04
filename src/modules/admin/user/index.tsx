
import Container from 'components/shared/Container'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectListUser, getListUser } from './redux'
import { useEffect, useState } from 'react'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import { debounce } from 'utils'
import { ImportExcel } from 'constants/functions/Excels'
import useTheme from 'hooks/useTheme'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Data, createData, columnData, Header, importColumns, importColumnData } from './constant'
import { Button, DialogActions } from '@mui/material'
import { CustomButton } from 'styles'
import useAlert from 'hooks/useAlert'

export const Users = () => {
  const dispatch = useAppDispatch()
  const { data: users, status } = useAppSelector(selectListUser)
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { user } = useAuth()
  const { device } = useWeb()
  const { theme } = useTheme()
  const { loadify } = useNotify()
  const confirm = useAlert()
  const [rowData, setRowData] = useState<Data[]>([])
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status === 'LOADING' ? true : false)

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleImport = (e) => {
    const response = ImportExcel(
      '/admin/user/excel/import',
      e.target.files[0],
      importColumns
    )
    loadify(response)
    response.then((data) => setImportDialog({ open: true, data: data.data.data }))
  }

  const handleCloseImport = () => {
    confirm({
      title: 'Discard Import',
      description: 'Do you want to discard all the change?',
      variant: 'error'
    }).then(() => setImportDialog({ ...importDialog, open: false }))
      .catch(() => setImportDialog({ ...importDialog }))
  }

  const handleConfirmImport = () => {
    const response = Axios({
      method: 'POST',
      url: '/admin/user/batch',
      body: importDialog.data
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListUser({}))
    })
  }

  const handleConfirm = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/admin/user/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListUser({})))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getListUser({ query: queryParams }))
  }, [dispatch, status, queryParams])

  useEffect(() => {
    const list = users.map((data: any) => {
      return createData(
        data._id,
        data.username,
        data.role?.name?.[lang] || data.role?.name?.['English'],
        data.email || '...',
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(list)
  }, [users, lang, user, device, navigate])

  return (
    <Container
      header={
        <Header
          styled={theme}
          navigate={navigate}
          handleImport={handleImport}
          handleSearch={handleSearch}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div style={{ position: 'relative' }}>
          <StickyTable columns={importColumnData} rows={importDialog.data} loading={loading} />
        </div>
        <DialogActions>
          <Button onClick={handleCloseImport}>Cancel</Button>
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: theme.background.secondary,
              color: theme.text.secondary,
            }}
            styled={theme}
            onClick={handleConfirmImport}
            autoFocus
          >
            Import 
          </CustomButton>
        </DialogActions> 
      </AlertDialog>
      <DeleteDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirm}
        handleClose={() => setDialog({ open: false, id: null })}
      ></DeleteDialog>
      <StickyTable columns={columnData} rows={rowData} loading={loading} />
    </Container>
  )
}

export { CreateUser } from './Create'
export { UpdateUser } from './Update'
export { DetailUser } from './Detail'
