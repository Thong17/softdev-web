
import Container from 'components/shared/Container'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectListRole, getListRole } from './redux'
import { useEffect, useState } from 'react'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { Data, createData, columnData, importColumnData, importColumns } from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions } from '@mui/material'
import { CustomButton } from 'styles'

export const Roles = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const confirm = useAlert()
  const { loadify } = useNotify()
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const [rowData, setRowData] = useState<Data[]>([])
  const { data: roles, status } = useAppSelector(selectListRole)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status === 'LOADING' ? true : false)
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleImport = (e) => {
    const response = ImportExcel(
      '/admin/role/excel/import',
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
      url: '/admin/role/batch',
      body: importDialog.data
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListRole({}))
    })
  }

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/admin/role/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListRole({ query: queryParams })))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getListRole({ query: queryParams }))
  }, [dispatch, status, queryParams])

  useEffect(() => {
    const listRoles = roles.map((role: any) => {
      return createData(
        role._id,
        role.name?.[lang] || role.name?.['English'],
        role.description || '...',
        role.createdBy?.username || '...',
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listRoles)
  }, [roles, lang, user, device, navigate])

  return (
    <Container
      header={
        <Header
          data={roles}
          styled={theme}
          navigate={navigate}
          handleSearch={handleSearch}
          handleImport={handleImport}
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
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDialog({ open: false, id: null })}
      ></DeleteDialog>
      <StickyTable columns={columnData} rows={rowData} loading={loading} />
    </Container>
  )
}

export { CreateRole } from './Create'
export { UpdateRole } from './Update'
export { DetailRole } from './Detail'
