import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListProduct, selectListProduct } from './redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import {
  Data,
  createData,
  productColumns,
  detailColumns,
  colorColumns,
  imageColumns,
  propertyColumns,
  optionColumns,
  productColumnData,
  detailColumnData,
  colorColumnData,
  propertyColumnData,
  optionColumnData,
  imageColumnData
} from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CustomButton } from 'styles'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { ListLayout } from 'components/layouts/ListLayout'

export const Products = () => {
  const dispatch = useAppDispatch()
  const { data: products, status } = useAppSelector(selectListProduct)
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
  const [importDialog, setImportDialog] = useState({ open: false, data: [], model: 'product' })
  const confirm = useAlert()
  const [isGrid, setIsGrid] = useState(true)
  const [columnData, setColumnData] = useState(productColumnData)

  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleImport = (e) => {
    const model = e.target.name
    let columns
    switch (model) {
      case 'product':
        columns = productColumns
        setColumnData(productColumnData)
        break
      case 'detail':
        columns = detailColumns
        setColumnData(detailColumnData)
        break
      case 'image':
        columns = imageColumns
        setColumnData(imageColumnData)
        break
      case 'color':
        columns = colorColumns
        setColumnData(colorColumnData)
        break
      case 'property':
        columns = propertyColumns
        setColumnData(propertyColumnData)
        break
      case 'option':
        columns = optionColumns
        setColumnData(optionColumnData)
        break
    }

    const response = ImportExcel(
      '/store/product/excel/import',
      e.target.files[0],
      columns
    )
    loadify(response)
    response.then((data) => {
      const importList = data.data.data.map((importData) => {
        const ImportAction = ({ no }) => (
          <IconButton
            onClick={() => {
              setImportDialog((prevData) => {
                return {
                  ...prevData,
                  data: prevData.data.filter(
                    (prevItem: any) => prevItem.no !== no
                  ),
                }
              })
            }}
            style={{ color: theme.text.secondary }}
          >
            <CloseRoundedIcon />
          </IconButton>
        )
        return { ...importData, action: <ImportAction no={importData?.no} /> }
      })

      return setImportDialog({ open: true, data: importList, model })
    })
  }

  const handleCloseImport = () => {
    confirm({
      title: 'Discard Import',
      description: 'Do you want to discard all the change?',
      variant: 'error',
    })
      .then(() => setImportDialog({ ...importDialog, open: false }))
      .catch(() => setImportDialog({ ...importDialog }))
  }

  const handleConfirmImport = () => {
    let url

    switch (importDialog.model) {
      case 'product':
        url = '/store/product/batch'
        break
      case 'image':
        url = '/store/product/image/batch'
        break
      case 'color':
        url = '/store/product/color/batch'
        break
      case 'property':
        url = '/store/product/property/batch'
        break
      case 'option':
        url = '/store/product/option/batch'
        break
    }

    const response = Axios({
      method: 'POST',
      url,
      body: importDialog.data,
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListProduct({ query: queryParams }))
    })
  }

  const handleConfirm = (id) => {
    const response = Axios({
      method: 'DELETE',
      url: `/store/product/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListProduct({})))

    setDialog({ open: false, id: null })
  }

  const changeLayout = () => {
    setIsGrid(!isGrid)
  }

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getListProduct({}))
  }, [dispatch, status])

  useEffect(() => {
    const listProducts = products.map((product: any) => {
      return createData(
        product._id,
        product.profile?.filename,
        product.name?.[lang] || product.name?.['English'],
        parseFloat(product?.price),
        product?.currency,
        product?.code || '...',
        product?.isStock,
        product?.brand?.name?.[lang] || product?.brand?.name?.['English'],
        product?.category?.name?.[lang] || product?.category?.name?.['English'],
        product.description || '...',
        product.createdBy || '...',
        product.status,
        user?.privilege,
        device,
        navigate,
        setDialog
      )
    })
    setRowData(listProducts)
  }, [products, lang, user, device, theme, navigate])

  return (
    <Container
      header={
        <Header
          changeLayout={changeLayout}
          isGrid={isGrid}
          data={products}
          styled={theme}
          navigate={navigate}
          handleSearch={handleSearch}
          handleImport={handleImport}
        />
      }
    >
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div style={{ position: 'relative' }}>
          <StickyTable
            columns={columnData}
            rows={importDialog.data}
            loading={loading}
          />
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
      {isGrid ? (
        <GridLayout>
          {rowData.map((obj: any, index) => {
            return (
              <GridItem
                key={index}
                title={obj.name}
                picture={obj.profile}
                subLeft={obj.category}
                subRight={obj.price}
                action={obj.action}
                status={obj.status}
                loading={loading}
              />
            )
          })}
        </GridLayout>
      ) : (
        <ListLayout data={rowData} isLoading={loading} />
      )}
    </Container>
  )
}

export { CreateProduct } from './Create'
export { UpdateProduct } from './Update'
export { DetailProduct } from './Detail'
export { PropertyProduct } from './Property'
