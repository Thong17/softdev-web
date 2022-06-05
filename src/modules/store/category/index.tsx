import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListCategory, selectListCategory } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Data, columnData, createData, importColumns, importColumnData } from './constant'
import { Header } from './Header'
import { ImportExcel } from 'constants/functions/Excels'
import { useSearchParams } from 'react-router-dom'
import useAlert from 'hooks/useAlert'
import { debounce } from 'utils'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions } from '@mui/material'
import { CustomButton } from 'styles'

export const Categories = () => {
  const dispatch = useAppDispatch()
  const { data: categories, status } = useAppSelector(selectListCategory)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status === 'LOADING' ? true : false)
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })
  const confirm = useAlert()

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleImport = (e) => {
    const response = ImportExcel(
      '/store/category/excel/import',
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
      url: '/store/category/batch',
      body: importDialog.data
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListCategory({ query: queryParams }))
    })
  }
  
  const handleConfirm = (id) => {
    const response = Axios({
      method: "DELETE",
      url: `/store/category/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListCategory({})))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== "INIT") return
    dispatch(getListCategory({}))
  }, [dispatch, status])

  useEffect(() => {
    const listCategories = categories.map((category: any) => {
      return createData(
        category._id,
        category.icon,
        category.name?.[lang] || category.name?.["English"],
        category.description || "...",
        category.createdBy || "...",
        category.status,
        user?.privilege,
        device,
        theme,
        navigate,
        setDialog
      )
    })
    setRowData(listCategories)
  }, [categories, lang, user, device, theme, navigate])

  return (
    <Container 
      header={
        <Header 
          data={categories}
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
        handleConfirm={handleConfirm}
        handleClose={() => setDialog({ open: false, id: null })}
      />
      <StickyTable columns={columnData} rows={rowData} />
    </Container>
  )
}

export { CreateCategory } from './Create'
export { UpdateCategory } from './Update'
export { DetailCategory } from './Detail'
