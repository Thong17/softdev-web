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
import { Button, DialogActions, IconButton, Skeleton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import { CustomButton } from 'styles'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { ListItem, ListLayout } from 'components/layouts/ListLayout'
import useConfig from 'hooks/useConfig'

export const Products = () => {
  const dispatch = useAppDispatch()
  const { data: products, status } = useAppSelector(selectListProduct)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify } = useNotify()
  const { toggleDisplay, display } = useConfig()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status !== 'SUCCESS' ? true : false)
  const [importDialog, setImportDialog] = useState({ open: false, data: [], model: 'product' })
  const confirm = useAlert()
  const [isGrid, setIsGrid] = useState(display === 'grid' ? true : false)
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
      '/organize/product/excel/import',
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
          >
            <CloseRoundedIcon style={{ color: theme.color.error, fontSize: 19 }} />
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
        url = '/organize/product/batch'
        break
      case 'image':
        url = '/organize/product/image/batch'
        break
      case 'color':
        url = '/organize/product/color/batch'
        break
      case 'property':
        url = '/organize/product/property/batch'
        break
      case 'option':
        url = '/organize/product/option/batch'
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
      url: `/organize/product/disable/${id}`,
    })
    loadify(response)
    response.then(() => dispatch(getListProduct({})))

    setDialog({ open: false, id: null })
  }

  const changeLayout = () => {
    setIsGrid(!isGrid)
    toggleDisplay(isGrid ? 'list' : 'grid')
  }

  useEffect(() => {
    if (status !== 'INIT') return
    dispatch(getListProduct({}))
  }, [dispatch, status])

  useEffect(() => {
    if (status !== 'SUCCESS') return
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [status])

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

  const handleClickProduct = (id) => {
    navigate(`/organize/product/detail/${id}`)
  }

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
        <div style={{ position: 'relative', padding: 10, boxSizing: 'border-box' }}>
          <StickyTable
            columns={columnData}
            rows={importDialog.data}
            style={{ maxWidth: '90vw' }}
          />
        </div>
        <DialogActions>
          <Button onClick={handleCloseImport} style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}>Cancel</Button>
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
              borderRadius: theme.radius.secondary
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
          {
            !loading ? rowData.map((obj: any, index) => {
              return (
                <GridItem
                  key={index}
                  title={obj.name}
                  picture={obj.profile}
                  subLeft={<><SellRoundedIcon fontSize='small' />{obj.price}</>}
                  subRight={<CustomButton onClick={() => handleClickProduct(obj.id)} styled={theme} style={{ padding: '0 5px', color: theme.text.primary, minWidth: 0 }}><TrendingFlatRoundedIcon fontSize='small' /></CustomButton>}
                  action={obj.action}
                  status={obj.status}
                />
              )
            }) : Array.apply(null, Array(25)).map((index, key) => {
              return <div key={key}>
                <Skeleton variant='rectangular' height={130} width={150} style={{ borderRadius: theme.radius.secondary }} />
                <div className="content" style={{ padding: '7px 0', boxSizing: 'border-box' }}>
                  <Skeleton variant='rectangular' height={30} width='100%' style={{ borderRadius: theme.radius.secondary }} />
                  <Skeleton variant='text' height={30} width={70} style={{ borderRadius: theme.radius.secondary }} />
                </div>
              </div>
            })
          }
        </GridLayout>
      ) : (
        <ListLayout isLoading={loading}>
          {
            !loading ? rowData.map((obj: any, index) => {
              return (
                <ListItem
                  onClick={() => handleClickProduct(obj.id)}
                  key={index}
                  picture={obj.profile}
                  title={<><span>{obj.name}</span><span>{obj.description}</span></>}
                  first={<><span className='subject'>Category</span><span>{obj.category}</span></>}
                  second={<><span className='subject'>Brand</span><span>{obj.brand}</span></>}
                  third={<><span className='subject'>Stock</span><span>{obj.stock}</span></>}
                  fourth={<><span className='subject'>Price</span><span>{obj.price}</span></>}
                  action={obj.action}
                  status={obj.status}
                />
              )
            }) : Array.apply(null, Array(25)).map((index, key) => {
              return <Skeleton key={key} variant='rectangular' width='100%' height={90} style={{ marginBottom: 10, borderRadius: theme.radius.secondary }} />
            })
          }
        </ListLayout>
      )}
    </Container>
  )
}

export { CreateProduct } from './Create'
export { UpdateProduct } from './Update'
export { DetailProduct } from './Detail'
export { ProductSetup } from './ProductSetup'
