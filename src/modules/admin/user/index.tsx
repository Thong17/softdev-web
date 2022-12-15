
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
import { Data, createData, columnData, importColumns, importColumnData } from './constant'
import { Header } from './Header'
import { Button, DialogActions, IconButton } from '@mui/material'
import { CustomButton } from 'styles'
import useAlert from 'hooks/useAlert'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const Users = () => {
  const dispatch = useAppDispatch()
  const { data: users, count, status } = useAppSelector(selectListUser)
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

  const updateQuery = debounce((value) => {
    handleQuery({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleFilter = (option) => {
    handleQuery({ filter: option.filter, sort: option.asc ? 'asc' : 'desc' })
  }

  const handleQuery = (data) => {
    let { limit, search } = data

    let query = {}
    const _limit = queryParams.get('limit')
    const _page = queryParams.get('page')
    const _search = queryParams.get('search')
    const _filter = queryParams.get('filter')
    const _sort = queryParams.get('sort')

    if (_limit) query = { limit: _limit, ...query }
    if (_page) query = { page: _page, ...query }
    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }

    if (limit || search) return setQueryParams({...query, ...data, page: 0})
    setQueryParams({...query, ...data})
  }

  useEffect(() => {
    dispatch(getListUser({ query: queryParams }))
  }, [dispatch, queryParams])

  const handleImport = (e) => {
    const response = ImportExcel(
      '/admin/user/excel/import',
      e.target.files[0],
      importColumns
    )
    loadify(response)
    response.then((data) => {
      const importList = data.data.data.map((importData) => {
        const ImportAction = ({ no }) => (
          <IconButton
            onClick={
              () => {
                setImportDialog((prevData) => {
                  return { ...prevData, data: prevData.data.filter((prevItem: any) => prevItem.no !== no) }
                })
              }
            }
            style={{ color: theme.text.secondary }}
          >
            <CloseRoundedIcon />
          </IconButton>
        )
        return { ...importData, action: <ImportAction no={importData?.no} /> }
      })

      return setImportDialog({ open: true, data: importList })
    })
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

  const handleConfirmDelete = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/admin/user/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListUser({})))

    setDialog({ open: false, id: null })
  }

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
          handleFilter={handleFilter}
          handleSearch={handleSearch}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div style={{ position: 'relative' }}>
          <StickyTable columns={importColumnData} rows={importDialog.data} style={{ maxWidth: '90vw' }} />
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
      <StickyTable 
        columns={columnData} 
        rows={rowData} 
        setQuery={handleQuery}
        count={count}
        limit={parseInt(queryParams.get('limit') || '10')}
        skip={status === 'SUCCESS' ? parseInt(queryParams.get('page') || '0') : 0}  
      />
    </Container>
  )
}

export { CreateUser } from './Create'
export { UpdateUser } from './Update'
export { DetailUser } from './Detail'
