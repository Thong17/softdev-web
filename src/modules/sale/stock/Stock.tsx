import Container from 'components/shared/Container'
import Breadcrumb from 'components/shared/Breadcrumbs'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  selectListStock,
  getListStock,
  getProduct,
  selectProduct,
  deleteStock
} from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import useLanguage from 'hooks/useLanguage'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductInfo } from 'components/shared/ProductInfo'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import { Form } from './Form'
import { createStockData, initStock, mapStockBody, stockColumnData } from './constant'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { ConvertForm } from './ConvertForm'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { useNavigate } from 'react-router-dom'
import { currencyFormat, timeFormat } from 'utils'
import useAuth from 'hooks/useAuth'
import useWeb from 'hooks/useWeb'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { Detail } from './Detail'
import useAlert from 'hooks/useAlert'
import { getListProduct } from 'modules/organize/product/redux'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { Box } from '@mui/material'
import { PriceHistoryPanel } from 'components/shared/dialog/PriceHistoryDialog'
import { SelectTab } from 'components/shared/form/SelectTab'

const Header = ({ stages, icon, styled, onClickAdd, onClickConvert, onClickHistory }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={icon} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onClickHistory && (
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: `${styled.text.secondary}22`,
              color: styled.text.secondary,
            }}
            styled={styled}
            onClick={() => onClickHistory()}
          >
            History
          </CustomButton>
        )}
        {onClickConvert && (
          <CustomButton
            style={{
              marginLeft: 10,
              backgroundColor: `${styled.color.success}22`,
              color: styled.color.success,
            }}
            styled={styled}
            onClick={() => onClickConvert()}
          >
            Convert
          </CustomButton>
        )}
        <CustomButton
          style={{
            marginLeft: 10,
            backgroundColor: `${styled.color.info}22`,
            color: styled.color.info,
          }}
          styled={styled}
          onClick={() => onClickAdd()}
        >
          Add Stock
        </CustomButton>
      </div>
    </>
  )
}

declare type ConversionColumn = 'date' | 'from' | 'to' | 'quantity' | 'produced' | 'unitCost' | 'createdBy'

const conversionColumnData: ITableColumn<ConversionColumn>[] = [
  { id: 'date', label: 'DATE', minWidth: 130 },
  { id: 'from', label: 'FROM', minWidth: 140 },
  { id: 'to', label: 'TO', minWidth: 140 },
  { id: 'quantity', label: 'CONVERTED' },
  { id: 'produced', label: 'PRODUCED' },
  { id: 'unitCost', label: 'UNIT COST' },
  { id: 'createdBy', label: 'BY' },
]

declare type PriceColumn = 'date' | 'oldPrice' | 'newPrice' | 'cost' | 'source' | 'createdBy'

const priceColumnData: ITableColumn<PriceColumn>[] = [
  { id: 'date', label: 'DATE', minWidth: 130 },
  { id: 'oldPrice', label: 'OLD PRICE' },
  { id: 'newPrice', label: 'NEW PRICE' },
  { id: 'cost', label: 'BATCH COST' },
  { id: 'source', label: 'CHANGED WHEN' },
  { id: 'createdBy', label: 'BY' },
]

const priceSources = { STOCK_CREATE: 'Adding stock', STOCK_UPDATE: 'Editing stock', CONVERSION: 'Converting stock' }

// Non-breaking spaces keep each history cell on one line
const noWrap = (value) => String(value ?? '').replace(/ /g, ' ')

// The same stock screen is reachable from Sale › Stock and from Organize › Product
export const Stock = ({ section = 'sale' }: { section?: 'sale' | 'organize' }) => {
  const dispatch = useAppDispatch()
  const { data: product, status } = useAppSelector(selectProduct)
  const { data: stocks } = useAppSelector(selectListStock)
  const { lang, language } = useLanguage()
  const { theme } = useTheme()
  const { id } = useParams()
  const [stockDialog, setStockDialog] = useState({
    open: false,
    productId: id,
    stockId: null,
  })
  const [detailDialog, setDetailDialog] = useState({
    open: false,
  })
  const [stockValue, setStockValue] = useState<any>(initStock)
  const [stockRowData, setStockRowData] = useState<any[]>([])
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify, loadify } = useNotify()
  const [detailValue, setDetailValue] = useState(initStock)
  const confirm = useAlert()
  const { width } = useWeb()
  const navigate = useNavigate()
  const [convertDialog, setConvertDialog] = useState({ open: false })
  // One History dialog with tabs: price changes, conversions, customer prices
  const [historyDialog, setHistoryDialog] = useState({ open: false })
  const [historyTab, setHistoryTab] = useState('price')
  const [conversions, setConversions] = useState<any[]>([])
  const [priceHistory, setPriceHistory] = useState<any[]>([])

  const stockPath = (productId) => section === 'organize'
    ? `/organize/product/stock/${productId}`
    : `/sale/stock/item/${productId}`

  const fetchConversions = () => {
    if (!id) return
    Axios({ method: 'GET', url: `/sale/stock/conversion/${id}` })
      .then((response) => setConversions(response?.data?.data || []))
      .catch(() => setConversions([]))
  }

  const fetchPriceHistory = () => {
    if (!id) return
    Axios({ method: 'GET', url: `/sale/stock/price-history/${id}` })
      .then((response) => setPriceHistory(response?.data?.data || []))
      .catch(() => setPriceHistory([]))
  }

  useEffect(() => {
    fetchConversions()
    fetchPriceHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // After a New Price is saved, show the new price and history
  const handleStockSaved = ({ priceChanged }) => {
    if (!priceChanged) return
    dispatch(getProduct({ id: id as string }))
    fetchPriceHistory()
  }

  // currencyFormat returns JSX, so it is kept on one line with a nowrap span
  // rather than noWrap (which only works on text)
  const money = (value, currency) => value !== undefined && value !== null
    ? <span style={{ whiteSpace: 'nowrap' }}>{currencyFormat(value, currency)}</span>
    : '--'
  const priceRowData = priceHistory.map((item) => ({
    id: item._id,
    date: noWrap(timeFormat(item.createdAt, 'YYYY-MM-DD HH:mm')),
    oldPrice: money(item.oldPrice, item.oldCurrency),
    newPrice: <b>{money(item.newPrice, item.newCurrency)}</b>,
    cost: money(item.cost, item.costCurrency),
    source: noWrap(priceSources[item.source] || '--'),
    createdBy: noWrap(item.createdBy?.username || '--'),
  }))

  // From the stock list (not product.stocks, which only loads with the page) so
  // adding, editing or deleting a batch updates the Convert button right away
  const availableStock = (stocks || []).reduce((total, stock: any) => total + (stock.quantity || 0), 0)
  const canConvert = status === 'SUCCESS' && availableStock > 0 && !!user?.privilege?.product?.update

  const handleConverted = () => {
    const params = new URLSearchParams()
    params.append('productId', id as string)
    dispatch(getProduct({ id: id as string }))
    dispatch(getListStock({ query: params }))
    fetchConversions()
    fetchPriceHistory()
  }

  const conversionRowData = conversions.map((conversion) => {
    const nameOf = (item) => item?.name?.[lang] || item?.name?.['English'] || '...'
    const isSource = conversion.fromProduct?._id === id
    const unitCost = conversion.producedQuantity ? conversion.totalCost / conversion.producedQuantity : 0
    return {
      // Clicking a row opens the other product's stock
      id: isSource ? conversion.toProduct?._id : conversion.fromProduct?._id,
      date: noWrap(timeFormat(conversion.createdAt, 'YYYY-MM-DD HH:mm')),
      from: noWrap(nameOf(conversion.fromProduct)),
      to: noWrap(nameOf(conversion.toProduct)),
      quantity: conversion.quantity,
      produced: noWrap(`${conversion.producedQuantity} (${conversion.direction === 'merge' ? '÷' : '×'}${conversion.ratio})`),
      unitCost: conversion.currency === 'KHR' ? `${Math.round(unitCost)}៛` : `$${Number(unitCost.toFixed(4))}`,
      createdBy: noWrap(conversion.createdBy?.username || '...'),
    }
  })

  // Tab name with its count in a small tonal circle
  const tabLabel = (label: string, count: number) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {label}
      {count > 0 && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 20,
            height: 20,
            padding: '0 5px',
            boxSizing: 'border-box',
            borderRadius: 10,
            backgroundColor: `${theme.color.info}22`,
            color: theme.color.info,
            fontSize: 11,
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </span>
  )

  const historyTabs = [
    { label: tabLabel('Price Changes', priceRowData.length), value: 'price' },
    { label: tabLabel('Conversions', conversionRowData.length), value: 'conversion' },
    ...(user?.privilege?.product?.detail ? [{ label: 'Customer Prices', value: 'customer' }] : []),
  ]

  const stockBreadcrumb = section === 'organize' ? [
    {
      title: language['ORGANIZE'],
      path: '/organize',
    },
    {
      title: language['PRODUCT'],
      path: '/organize/product',
    },
    {
      title: language['UPDATE'],
      path: `/organize/product/update/${id}`,
    },
    {
      title: language['SETUP'],
      path: `/organize/product/update/property/${id}`,
    },
    {
      title: language['STOCK'],
    },
  ] : [
    {
      title: 'Sale',
      path: '/sale',
    },
    {
      title: 'Stock',
      path: '/sale/stock',
    },
    {
      title:
        status === 'SUCCESS'
          ? product?.name?.[lang] || product?.name?.['English']
          : '...',
    },
  ]

  useEffect(() => {
    if (id) {
      dispatch(getProduct({ id }))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id) {
      const params = new URLSearchParams()
      params.append('productId', id)
      dispatch(getListStock({ query: params }))
    }
  }, [dispatch, id])

  useEffect(() => {
    const handleEditStock = async (id) => {
      try {
        const defaultValue: any = await Axios({
          method: 'GET',
          url: `/sale/stock/detail/${id}`
        })
        const body = mapStockBody(defaultValue?.data?.data)
        
        setStockValue(body)
        setStockDialog({ ...stockDialog, stockId: id, open: true })
      } catch (err: any) {
        notify(err.message)
      }
    }
  
    const handleDeleteStock = (id) => {
      confirm({
        title: 'Delete Stock',
        description: 'Do you want to delete the stock?',
        variant: 'error'
      }).then(() => {
        const response = Axios({
          method: 'DELETE',
          url: `/sale/stock/disable/${id}`
        })
        loadify(response)
        response.then(result => {
          dispatch(deleteStock(result?.data?.data?._id))
          dispatch(getListProduct({}))
        })
      })
        .catch(() => {})
    }

    const handleViewStock = async (id) => {
      try {
        const defaultValue: any = await Axios({
          method: 'GET',
          url: `/sale/stock/detail/${id}`
        })
        setDetailValue({ ...defaultValue?.data?.data })
        setDetailDialog({ open: true })
      } catch (err: any) {
        notify(err.message)
      }
    }

    const rowData = stocks?.map((stock: any) => {
      let options = stock.options?.map((opt) => {
        return opt?.name?.[lang] || opt?.name?.['English']
      })

      return createStockData(
        stock._id,
        stock.cost,
        stock.currency,
        stock.quantity,
        stock.remain,
        stock.code,
        stock.expireAt,
        stock.alertAt,
        stock.color?.code,
        options,
        stock.createdBy,
        user?.privilege,
        device,
        theme,
        handleEditStock,
        handleDeleteStock,
        handleViewStock,
        stock.conversion?.fromProduct?.name?.[lang] || stock.conversion?.fromProduct?.name?.['English']
      )
    })
    setStockRowData(rowData)
  }, [stocks, product, device, lang, user, theme, notify, loadify, confirm, dispatch, stockDialog])

  const handleAddStock = () => {
    setStockValue(initStock)
    setStockDialog({ ...stockDialog, open: true })
  }

  const handleScanProduct = async (code) => {
    const stock = stockRowData.find(item => item.code === code)
    if (!stock) {
      setStockValue({...initStock, code})
      setStockDialog({ ...stockDialog, open: true })
      return
    } else {
      try {
        const defaultValue: any = await Axios({
          method: 'GET',
          url: `/sale/stock/detail/${stock.id}`
        })
        const body = mapStockBody(defaultValue?.data?.data)
    
        setStockValue(body)
        setStockDialog({ ...stockDialog, stockId: stock.id, open: true })
      } catch (err: any) {
        notify(err.message)
      }
    }
  }

  return (
    <Container
      header={
        <Header
          stages={stockBreadcrumb}
          icon={section === 'organize' ? <StorefrontRoundedIcon /> : <AttachMoneyRoundedIcon />}
          styled={theme}
          onClickAdd={handleAddStock}
          onClickConvert={canConvert ? () => setConvertDialog({ open: true }) : undefined}
          onClickHistory={status === 'SUCCESS' ? () => setHistoryDialog({ open: true }) : undefined}
        />
      }
    >
      <AlertDialog isOpen={historyDialog.open} handleClose={() => setHistoryDialog({ open: false })}>
        <DialogTitle title='History' onClose={() => setHistoryDialog({ open: false })} />
        {/* Fixed height so switching tabs doesn't resize the dialog; the tab
            content scrolls under the tabs */}
        <div style={{ width: width < 1024 ? '92vw' : '85vw', maxWidth: 1300, height: '70vh', padding: '0 20px 10px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 15 }}>
          <SelectTab
            selected={historyTab}
            options={historyTabs}
            onChange={(value) => setHistoryTab(value)}
          />
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {historyTab === 'price' && (
            priceRowData.length
              ? <StickyTable columns={priceColumnData} rows={priceRowData} pagination={false} />
              : <div style={{ color: theme.text.tertiary, textAlign: 'center', padding: 20 }}>No price changes yet. Set a New Price when adding or converting stock.</div>
          )}
          {historyTab === 'conversion' && (
            conversionRowData.length
              ? (
                <StickyTable
                  columns={conversionColumnData}
                  rows={conversionRowData}
                  pagination={false}
                  handleClick={(productId) => {
                    if (!productId) return
                    setHistoryDialog({ open: false })
                    navigate(stockPath(productId))
                  }}
                />
              )
              : <div style={{ color: theme.text.tertiary, textAlign: 'center', padding: 20 }}>No conversions yet.</div>
          )}
          {historyTab === 'customer' && id && (
            <PriceHistoryPanel product={{ _id: id, name: product?.name?.[lang] || product?.name?.['English'] }} />
          )}
          </div>
        </div>
      </AlertDialog>
      <BarcodeReader onScan={handleScanProduct} onError={() => {}} />
      <ConvertForm
        dialog={convertDialog}
        setDialog={setConvertDialog}
        product={product}
        stocks={stocks}
        theme={theme}
        onConverted={handleConverted}
      />
      <Form
        dialog={stockDialog}
        setDialog={setStockDialog}
        theme={theme}
        defaultValues={stockValue}
        colors={product?.colors || []}
        properties={product?.properties || []}
        options={product?.options || []}
        product={product}
        stocks={stocks}
        onSaved={handleStockSaved}
      />
      <Detail
        dialog={detailDialog}
        setDialog={setDetailDialog}
        defaultValues={detailValue}
        theme={theme}
        product={product}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: width > 1024 ? '400px 1fr' : '1fr',
          gridGap: 20,
          '& tr[data-id="warning"] td': {
            backgroundColor: theme.color.warning + '11',
            color: theme.color.warning + '!important'
          },
          '& tr[data-id="error"] td': {
            backgroundColor: theme.color.error + '11',
            color: theme.color.error + '!important'
          },
          '& tr[data-value="0"] td': {
            backgroundColor: theme.text.quaternary + '22',
            color: theme.text.quaternary + '!important'
          },
        }}
      >
        <ProductInfo info={product} loading={status !== 'SUCCESS' ? true : false} />
        <StickyTable
          columns={stockColumnData}
          rows={stockRowData}
        />
      </Box>
    </Container>
  )
}
