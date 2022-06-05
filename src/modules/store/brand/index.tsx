import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListBrand, selectListBrand } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { Data, createData, columnData, importColumns, importColumnData } from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions } from '@mui/material'
import { CustomButton } from 'styles'

export const Brands = () => {
  const dispatch = useAppDispatch()
  const { data: brands, status } = useAppSelector(selectListBrand)
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
      '/store/brand/excel/import',
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
      url: '/store/brand/batch',
      body: importDialog.data
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListBrand({ query: queryParams }))
    })
  }
  
  const handleConfirm = (id) => {
    const response = Axios({
      method: "DELETE",
      url: `/store/brand/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListBrand({})))

    setDialog({ open: false, id: null })
  }

  useEffect(() => {
    if (status !== "INIT") return
    dispatch(getListBrand({}))
  }, [dispatch, status])

  useEffect(() => {
    const listBrands = brands.map((brand: any) => {
      return createData(
        brand._id,
        brand.icon,
        brand.name?.[lang] || brand.name?.["English"],
        brand.description || "...",
        brand.createdBy || "...",
        brand.status,
        user?.privilege,
        device,
        theme,
        navigate,
        setDialog
      )
    })
    setRowData(listBrands)
  }, [brands, lang, user, device, theme, navigate])

  return (
    <Container 
      header={
        <Header 
          data={brands}
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

export { CreateBrand } from './Create'
export { UpdateBrand } from './Update'
export { DetailBrand } from './Detail'
