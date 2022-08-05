import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListProduct, selectListProduct } from 'modules/organize/product/redux'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import {
  Data,
  createData,
  importColumns,
  importColumnData,
} from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import { debounce } from 'utils'
import { useSearchParams } from 'react-router-dom'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { Button, DialogActions, IconButton, Skeleton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CustomButton } from 'styles'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { ListItem, ListLayout } from 'components/layouts/ListLayout'
import useConfig from 'hooks/useConfig'
import { StockStatus } from 'components/shared/StockStatus'

export const Stocks = () => {
  const dispatch = useAppDispatch()
  const { data: products, status } = useAppSelector(selectListProduct)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify, notify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const navigate = useNavigate()
  const { toggleDisplay, display } = useConfig()
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(status !== 'SUCCESS' ? true : false)
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })
  const confirm = useAlert()
  const [isGrid, setIsGrid] = useState(display === 'grid' ? true : false)
  
  const updateQuery = debounce((value) => {
    setLoading(false)
    setQueryParams({ search: value })
  }, 300)

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  const handleImport = (e) => {
    const response = ImportExcel(
      '/organize/product/excel/import',
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
      variant: 'error',
    })
      .then(() => setImportDialog({ ...importDialog, open: false }))
      .catch(() => setImportDialog({ ...importDialog }))
  }

  const handleConfirmImport = () => {
    const response = Axios({
      method: 'POST',
      url: '/sale/stock/batch',
      body: importDialog.data,
    })
    loadify(response)
    response.then(() => {
      setImportDialog({ ...importDialog, open: false })
      dispatch(getListProduct({ query: queryParams }))
    })
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
    const handleEnableStock = (id) => {
      confirm({
        title: 'Are you sure you want to enable stock?',
        description: 'This product stock is currently not enabled. By confirm this you will enable stock for this product.',
        variant: 'info'
      }).then(() => {
        Axios({
          method: 'PUT',
          url: `/organize/product/stock/${id}/enable`
        }).then((result) => {
          if (result?.data?.code !== 'SUCCESS') return notify(result?.data?.msg, 'error')
          dispatch(getListProduct({ query: queryParams }))
          notify(result?.data?.msg, 'success')
        }).catch((err) => notify(err?.response?.data?.msg, 'error'))
      }).catch(() => {})
    }

    const listProducts = products.map((product: any) => {
      return createData(
        product._id,
        product.profile?.filename,
        product.name?.[lang] || product.name?.['English'],
        product.stocks,
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
        handleEnableStock
      )
    })
    setRowData(listProducts)
  }, [products, lang, user, device, theme, queryParams, navigate, confirm, notify, dispatch])

  return (
    <Container
      header={
        <Header
          changeLayout={changeLayout}
          isGrid={isGrid}
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
            columns={importColumnData}
            rows={importDialog.data}
            loading={loading}
            style={{ maxWidth: '90vw' }}
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
      { isGrid ? <GridLayout>
        {
          !loading ? rowData.map((obj: any, index) => {
            return (
              <GridItem
                key={index}
                title={obj.name}
                picture={obj.profile}
                subLeft='Qty'
                subRight={<StockStatus qty={obj.stock} min={obj.alertAt} />}
                action={obj.action}
                status={obj.status}
              />
            )
          }) : Array.apply(null, Array(25)).map((value, key) => {
            return <div key={key}>
              <Skeleton variant='rectangular' height={130} width={150} style={{ borderRadius: theme.radius.secondary }} />
              <div className="content" style={{ padding: '7px 0', boxSizing: 'border-box' }}>
                <Skeleton variant='rectangular' height={30} width='100%' style={{ borderRadius: theme.radius.secondary }} />
                <Skeleton variant='text' height={30} width={70} style={{ borderRadius: theme.radius.secondary }} />
              </div>
            </div>
          })
        }
      </GridLayout> : <ListLayout isLoading={loading}>
        {
          !loading ? rowData.map((obj: any, index) => {
            return (
              <ListItem
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
          }) : Array.apply(null, Array(25)).map((value, key) => {
            return <Skeleton key={key} variant='rectangular' width='100%' height={90} style={{ marginBottom: 10, borderRadius: theme.radius.secondary }} />
          })
        }
      </ListLayout> }
    </Container>
  )
}

export { Stock } from './Stock'
