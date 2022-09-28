import Container from 'components/shared/Container'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StickyTable } from 'components/shared/table/StickyTable'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { Header } from './Header'
import { Data, createData, importColumns, importColumnData } from './constant'
import { ImportExcel } from 'constants/functions/Excels'
import { debounce } from 'utils'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import {
  Button,
  CircularProgress,
  DialogActions,
  IconButton,
  Skeleton,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CustomButton } from 'styles'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { ListItem, ListLayout } from 'components/layouts/ListLayout'
import useConfig from 'hooks/useConfig'
import { QuantityStatus } from 'components/shared/QuantityStatus'
import {
  getListProduct,
  selectListProduct,
} from 'modules/organize/product/redux'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { getListCodeProduct, selectListCodeProduct } from 'shared/redux'

export const Stocks = () => {
  const dispatch = useAppDispatch()
  const {
    data: products,
    status,
    count: countProduct,
    hasMore: hasMoreProduct,
  } = useAppSelector(selectListProduct)
  const { data: listCode } = useAppSelector(selectListCodeProduct)
  const [hasMore, setHasMore] = useState(true)
  const [count, setCount] = useState(0)
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { loadify, notify } = useNotify()
  const [rowData, setRowData] = useState<Data[]>([])
  const navigate = useNavigate()
  const { toggleDisplay, display } = useConfig()
  const [loading, setLoading] = useState(status !== 'SUCCESS' ? true : false)
  const [importDialog, setImportDialog] = useState({ open: false, data: [] })
  const confirm = useAlert()
  const [isGrid, setIsGrid] = useState(display === 'grid' ? true : false)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterObj, setFilterObj] = useState<any>({
    filter: 'createdAt',
    asc: false,
  })
  const limit = 20

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
      dispatch(getListProduct({}))
    })
  }

  const changeLayout = () => {
    setIsGrid(!isGrid)
    toggleDisplay(isGrid ? 'list' : 'grid')
  }

  useEffect(() => {
    if (status !== 'SUCCESS') return
    const handleEnableStock = (id) => {
      confirm({
        title: 'Are you sure you want to enable stock?',
        description:
          'This product stock is currently not enabled. By confirm this you will enable stock for this product.',
        variant: 'info',
      })
        .then(() => {
          Axios({
            method: 'PUT',
            url: `/organize/product/stock/${id}/enable`,
          })
            .then((result) => {
              if (result?.data?.code !== 'SUCCESS')
                return notify(result?.data?.msg, 'error')
              notify(result?.data?.msg, 'success')
            })
            .catch((err) => notify(err?.response?.data?.msg, 'error'))
        })
        .catch(() => {})
    }

    let unmounted = false
    setHasMore(hasMoreProduct || false)
    setCount(countProduct || 0)
    setTimeout(() => {
      if (!unmounted) {
        const listProducts = products.map((product: any) => {
          return createData(
            product._id,
            product.profile?.filename,
            product.tags,
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
            product.createdAt,
            product.status,
            user?.privilege,
            user?.drawer?.buyRate,
            device,
            navigate,
            handleEnableStock
          )
        })
    
        setRowData((prev) => [...prev, ...listProducts])
        setLoading(false)
        setFetching(false)
      }
    }, 100)
    return () => {
      unmounted = true
    }
    // eslint-disable-next-line
  }, [status, products, lang, hasMoreProduct, countProduct])

  const updateQuery = debounce((value) => {
    if (hasMore) {
      setRowData([])
      setOffset(0)
    }
    setSearch(value)
  }, 300)

  const handleFilter = (option) => {
    setFilterObj(option)
    if (hasMore) {
      setRowData([])
      setOffset(0)
    }
  }

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

  useEffect(() => {
    dispatch(getListCodeProduct())
  }, [dispatch])
  
  const observer: any = useRef()
  const [fetching, setFetching] = useState(false)
  const lastProductElement = useCallback(
    (node) => {
      if (fetching) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && count && count > offset + limit) {
          setOffset((prev) => prev + limit)
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetching, count, offset]
  )

  useEffect(() => {
    if (!hasMore) {
      const _search = new RegExp(search || '', 'i')
      setRowData((prevData) => {
        return prevData
          .map((data) => {
            let obj = data

            if (!_search.test(data.tags)) {
              obj['display'] = 'none'
            } else {
              obj['display'] = 'block'
            }
            return obj
          })
          .sort((a, b) => {
            if (!filterObj.asc) {
              if (b[filterObj.filter] < a[filterObj.filter]) return -1
              if (b[filterObj.filter] > a[filterObj.filter]) return 1
              return 0
            } else {
              if (a[filterObj.filter] < b[filterObj.filter]) return -1
              if (a[filterObj.filter] > b[filterObj.filter]) return 1
              return 0
            }
          })
      })
      return
    }
    setFetching(true)
    const query = new URLSearchParams()
    query.append('search', search)
    query.append('limit', limit.toString())
    query.append('offset', offset.toString())
    query.append('filter', filterObj.filter)
    query.append('sort', filterObj.asc ? 'asc' : 'desc')
    dispatch(getListProduct({ query }))
    // eslint-disable-next-line
  }, [dispatch, offset, search, filterObj])

  const handleScanProduct = (code) => {
    const scannedProduct = listCode.find((item: any) => item.code === code)
    if (!scannedProduct) return
    if (scannedProduct.isStock) navigate(`/sale/stock/item/${scannedProduct._id}`)
    else {
      confirm({
        title: 'Are you sure you want to enable stock?',
        description:
          'This product stock is currently not enabled. By confirm this you will enable stock for this product.',
        variant: 'info',
      })
        .then(() => {
          Axios({
            method: 'PUT',
            url: `/organize/product/stock/${scannedProduct._id}/enable`,
          })
            .then((result) => {
              navigate(`/sale/stock/item/${scannedProduct._id}`)
            })
            .catch((err) => notify(err?.response?.data?.msg, 'error'))
        })
        .catch(() => {})
    }
  }

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
          handleFilter={handleFilter}
        />
      }
    >
      <BarcodeReader onScan={handleScanProduct} onError={() => {}} />
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
      {isGrid ? (
        <GridLayout>
          {!loading
            ? rowData.map((obj: any, index) => {
                if (rowData.length === index + 1) {
                  return (
                    <GridItem
                      ref={lastProductElement}
                      key={index}
                      title={obj.name}
                      picture={obj.profile}
                      subLeft='Qty'
                      subRight={
                        <QuantityStatus
                          qty={obj.stock}
                          min={obj.alertAt}
                          label='Left'
                        />
                      }
                      action={obj.action}
                      status={obj.status}
                      display={obj.display}
                      expireAt={obj.expireAt}
                    />
                  )
                } else {
                  return (
                    <GridItem
                      key={index}
                      title={obj.name}
                      picture={obj.profile}
                      subLeft='Qty'
                      subRight={
                        <QuantityStatus
                          qty={obj.stock}
                          min={obj.alertAt}
                          label='Left'
                        />
                      }
                      action={obj.action}
                      status={obj.status}
                      display={obj.display}
                      expireAt={obj.expireAt}
                    />
                  )
                }
              })
            : Array.apply(null, Array(25)).map((value, key) => {
                return (
                  <div key={key}>
                    <Skeleton
                      variant='rectangular'
                      height={130}
                      width={150}
                      style={{ borderRadius: theme.radius.secondary }}
                    />
                    <div
                      className='content'
                      style={{ padding: '7px 0', boxSizing: 'border-box' }}
                    >
                      <Skeleton
                        variant='rectangular'
                        height={30}
                        width='100%'
                        style={{ borderRadius: theme.radius.secondary }}
                      />
                      <Skeleton
                        variant='text'
                        height={30}
                        width={70}
                        style={{ borderRadius: theme.radius.secondary }}
                      />
                    </div>
                  </div>
                )
              })}
        </GridLayout>
      ) : (
        <ListLayout isLoading={loading}>
          {!loading
            ? rowData.map((obj: any, index) => {
                if (rowData.length === index + 1) {
                  return (
                    <ListItem
                      ref={lastProductElement}
                      key={index}
                      picture={obj.profile}
                      title={
                        <>
                          <span>{obj.name}</span>
                          <span>{obj.description}</span>
                        </>
                      }
                      first={
                        <>
                          <span className='subject'>Category</span>
                          <span>{obj.category}</span>
                        </>
                      }
                      second={
                        <>
                          <span className='subject'>Brand</span>
                          <span>{obj.brand}</span>
                        </>
                      }
                      third={
                        <>
                          <span className='subject'>Stock</span>
                          <span>{obj.stock}</span>
                        </>
                      }
                      fourth={
                        <>
                          <span className='subject'>Price</span>
                          <span>{obj.priceTag}</span>
                        </>
                      }
                      action={obj.action}
                      status={obj.status}
                      display={obj.display}
                    />
                  )
                } else {
                  return (
                    <ListItem
                      key={index}
                      picture={obj.profile}
                      title={
                        <>
                          <span>{obj.name}</span>
                          <span>{obj.description}</span>
                        </>
                      }
                      first={
                        <>
                          <span className='subject'>Category</span>
                          <span>{obj.category}</span>
                        </>
                      }
                      second={
                        <>
                          <span className='subject'>Brand</span>
                          <span>{obj.brand}</span>
                        </>
                      }
                      third={
                        <>
                          <span className='subject'>Stock</span>
                          <span>{obj.stock}</span>
                        </>
                      }
                      fourth={
                        <>
                          <span className='subject'>Price</span>
                          <span>{obj.priceTag}</span>
                        </>
                      }
                      action={obj.action}
                      status={obj.status}
                      display={obj.display}
                    />
                  )
                }
              })
            : Array.apply(null, Array(25)).map((value, key) => {
                return (
                  <Skeleton
                    key={key}
                    variant='rectangular'
                    width='100%'
                    height={90}
                    style={{
                      marginBottom: 10,
                      borderRadius: theme.radius.secondary,
                    }}
                  />
                )
              })}
        </ListLayout>
      )}
      {fetching && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <CircularProgress style={{ width: 30, height: 30 }} />
        </div>
      )}
    </Container>
  )
}

export { Stock } from './Stock'
