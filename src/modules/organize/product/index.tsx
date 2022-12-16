import Container from 'components/shared/Container'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  productColumnData,
  productImportColumns,
} from './constant'
import { debounce } from 'utils'
import useAlert from 'hooks/useAlert'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import {
  Button,
  DialogActions,
  Skeleton,
  CircularProgress,
  IconButton,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SellRoundedIcon from '@mui/icons-material/SellRounded'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import { CustomButton } from 'styles'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { ListItem, ListLayout } from 'components/layouts/ListLayout'
import useConfig from 'hooks/useConfig'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { getListCodeProduct, selectListCodeProduct } from 'shared/redux'
import { ImportExcel } from 'constants/functions/Excels'
import { languages } from 'contexts/language/constant'

const mappedImportList = (data, setImportDialog, theme) => {
  const mappedData = data.map((importData) => {
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
        <CloseRoundedIcon
          style={{ color: theme.color.error, fontSize: 19 }}
        />
      </IconButton>
    )
    let mappedData = { ...importData, action: <ImportAction no={importData?.no} /> }
    Object.keys(languages).forEach(lang => {
      mappedData[`name${lang}`] = importData.name[lang]
      mappedData['brand'] = importData.brand?.name[lang] || importData.brand?.name['English']
      mappedData['category'] = importData.category?.name[lang] || importData.category?.name['English']
    })
    return mappedData
  })
  
  return mappedData
}

export const Products = () => {
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
  const { notify, loadify } = useNotify()
  const { toggleDisplay, display } = useConfig()
  const [rowData, setRowData] = useState<Data[]>([])
  const [dialog, setDialog] = useState({ open: false, id: null })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(status !== 'SUCCESS' ? true : false)
  const [importDialog, setImportDialog] = useState({
    open: false,
    data: [],
    model: 'product',
  })
  const confirm = useAlert()
  const [isGrid, setIsGrid] = useState(display === 'grid' ? true : false)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [filterObj, setFilterObj] = useState<any>({
    filter: 'createdAt',
    asc: false,
  })
  const limit = 40

  const handleImport = (e) => {
    const model = e.target.name

    const response = ImportExcel(
      '/organize/product/excel/import',
      e.target.files[0],
      productImportColumns
    )
    loadify(response)
    response.then((data) => {
      const importList = data.data.data
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
    let url = '/organize/product/batch'
    Axios({
      method: 'POST',
      url,
      body: importDialog.data,
    })
      .then(() => {
        setImportDialog({ ...importDialog, open: false })
        setHasMore(true)
        setRowData([])
        setOffset(0)
        const query = new URLSearchParams()
        query.append('search', search)
        query.append('limit', limit.toString())
        query.append('offset', '0')
        query.append('filter', filterObj.filter)
        query.append('sort', filterObj.asc ? 'asc' : 'desc')
        dispatch(getListProduct({ query }))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
  }

  const handleConfirm = (id) => {
    Axios({
      method: 'DELETE',
      url: `/organize/product/disable/${id}`,
    })
      .then(() => {
        setHasMore(true)
        setRowData([])
        setOffset(0)
        // setFetching(true)
        const query = new URLSearchParams()
        query.append('search', search)
        query.append('limit', limit.toString())
        query.append('offset', '0')
        query.append('filter', filterObj.filter)
        query.append('sort', filterObj.asc ? 'asc' : 'desc')
        dispatch(getListProduct({ query }))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))

    setDialog({ open: false, id: null })
  }

  const changeLayout = () => {
    setIsGrid(!isGrid)
    toggleDisplay(isGrid ? 'list' : 'grid')
  }

  useEffect(() => {
    dispatch(getListCodeProduct())
  }, [dispatch])

  useEffect(() => {
    if (status !== 'SUCCESS') return

    let unmounted = false
    setHasMore(hasMoreProduct || false)
    setCount(countProduct || 0)
    setTimeout(() => {
      if (!unmounted) {
        const listProducts = products.map((product: any) => {
          return createData(
            product._id,
            product.profile?.filename,
            product.name?.[lang] || product.name?.['English'],
            product.tags,
            parseFloat(product?.price),
            product?.currency,
            product?.code || '...',
            product?.isStock,
            product?.brand?.name?.[lang] || product?.brand?.name?.['English'],
            product?.category?.name?.[lang] ||
              product?.category?.name?.['English'],
            product.description || '...',
            product.createdBy || '...',
            product.createdAt,
            product.status,
            user?.privilege,
            user?.drawer?.buyRate,
            device,
            navigate,
            setDialog
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
      setOffset(0)
      setRowData([])
    }
    setSearch(value)
  }, 300)

  const handleFilter = (option) => {
    setFilterObj(option)
    if (hasMore) {
      setOffset(0)
      setRowData([])
    }
  }

  const handleSearch = (e) => {
    updateQuery(e.target.value)
  }

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

  const handleClickProduct = (id) => {
    navigate(`/organize/product/detail/${id}`)
  }

  const handleScanProduct = (code) => {
    const scannedProduct = listCode.find((item: any) => item.code === code)
    if (!scannedProduct) return
    navigate(`/organize/product/update/${scannedProduct._id}`)
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
          handleFilter={handleFilter}
          handleImport={handleImport}
        />
      }
    >
      <BarcodeReader onScan={handleScanProduct} onError={() => {}} />
      <AlertDialog isOpen={importDialog.open} handleClose={handleCloseImport}>
        <div
          style={{ position: 'relative', padding: 10, boxSizing: 'border-box' }}
        >
          <StickyTable
            columns={productColumnData}
            rows={mappedImportList(importDialog.data, setImportDialog, theme)}
            style={{ maxWidth: '90vw' }}
          />
        </div>
        <DialogActions>
          <Button
            onClick={handleCloseImport}
            style={{
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
            }}
          >
            Cancel
          </Button>
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
              borderRadius: theme.radius.secondary,
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
          {!loading
            ? rowData.map((obj: any, index) => {
                if (rowData.length === index + 1) {
                  return (
                    <GridItem
                      ref={lastProductElement}
                      key={index}
                      title={obj.name}
                      picture={obj.profile}
                      display={obj.display}
                      subLeft={
                        <>
                          <SellRoundedIcon fontSize='small' />
                          {obj.priceTag}
                        </>
                      }
                      subRight={
                        <CustomButton
                          onClick={() => handleClickProduct(obj.id)}
                          styled={theme}
                          style={{
                            padding: '0 5px',
                            color: theme.text.primary,
                            minWidth: 0,
                          }}
                        >
                          <TrendingFlatRoundedIcon fontSize='small' />
                        </CustomButton>
                      }
                      action={obj.action}
                      status={obj.status}
                    />
                  )
                } else {
                  return (
                    <GridItem
                      key={index}
                      title={obj.name}
                      picture={obj.profile}
                      display={obj.display}
                      subLeft={
                        <>
                          <SellRoundedIcon fontSize='small' />
                          {obj.priceTag}
                        </>
                      }
                      subRight={
                        <CustomButton
                          onClick={() => handleClickProduct(obj.id)}
                          styled={theme}
                          style={{
                            padding: '0 5px',
                            color: theme.text.primary,
                            minWidth: 0,
                          }}
                        >
                          <TrendingFlatRoundedIcon fontSize='small' />
                        </CustomButton>
                      }
                      action={obj.action}
                      status={obj.status}
                    />
                  )
                }
              })
            : Array.apply(null, Array(25)).map((index, key) => {
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
                      onClick={() => handleClickProduct(obj.id)}
                      key={index}
                      picture={obj.profile}
                      display={obj.display}
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
                    />
                  )
                } else {
                  return (
                    <ListItem
                      onClick={() => handleClickProduct(obj.id)}
                      key={index}
                      picture={obj.profile}
                      display={obj.display}
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
                    />
                  )
                }
              })
            : Array.apply(null, Array(25)).map((index, key) => {
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

export { CreateProduct } from './Create'
export { UpdateProduct } from './Update'
export { DetailProduct } from './Detail'
export { ProductSetup } from './ProductSetup'
