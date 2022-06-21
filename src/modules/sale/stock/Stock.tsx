import Container from 'components/shared/Container'
import Breadcrumb from 'components/shared/Breadcrumbs'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import {
  selectListStock,
  getListStock,
  getProduct,
  selectProduct,
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
import { StickyTable } from 'components/shared/table/StickyTable'
import useAuth from 'hooks/useAuth'
import useWeb from 'hooks/useWeb'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { Detail } from './Detail'

const Header = ({ stages, styled, onClickAdd }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<AttachMoneyRoundedIcon />} />
      <CustomButton
        style={{
          marginLeft: 10,
          backgroundColor: styled.background.secondary,
          color: styled.text.secondary,
        }}
        styled={styled}
        onClick={() => onClickAdd()}
      >
        Add Stock
      </CustomButton>
    </>
  )
}

export const Stock = () => {
  const dispatch = useAppDispatch()
  const { data: product, status } = useAppSelector(selectProduct)
  const { data: stocks, status: stockStatus } = useAppSelector(selectListStock)
  const { lang } = useLanguage()
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
  const [stockValue, setStockValue] = useState(initStock)
  const [stockRowData, setStockRowData] = useState<Object[]>([])
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify } = useNotify()
  const [detailValue, setDetailValue] = useState(initStock)

  const stockBreadcrumb = [
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
    if (status !== 'INIT') return
    if (id) {
      dispatch(getProduct({ id }))
    }
  }, [dispatch, status, id])

  useEffect(() => {
    if (stockStatus !== 'INIT') return
    dispatch(getListStock({}))
  }, [dispatch, stockStatus])

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
      console.log(id);
    }

    const handleViewStock = async (id) => {
      try {
        const defaultValue: any = await Axios({
          method: 'GET',
          url: `/sale/stock/detail/${id}`
        })
        setDetailValue(defaultValue?.data?.data)
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
        handleViewStock
      )
    })
    setStockRowData(rowData)
  }, [stocks, device, lang, user, theme, notify, stockDialog])

  const handleAddStock = () => {
    setStockValue(initStock)
    setStockDialog({ ...stockDialog, open: true })
  }

  return (
    <Container
      header={
        <Header
          stages={stockBreadcrumb}
          styled={theme}
          onClickAdd={handleAddStock}
        />
      }
    >
      <Form
        dialog={stockDialog}
        setDialog={setStockDialog}
        theme={theme}
        defaultValues={stockValue}
        colors={product?.colors || []}
        properties={product?.properties || []}
        options={product?.options || []}
      />
      <Detail
        dialog={detailDialog}
        setDialog={setDetailDialog}
        defaultValues={detailValue}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          paddingTop: 10,
          gridGap: 20
        }}
      >
        <ProductInfo info={product} />
        <StickyTable
          columns={stockColumnData}
          rows={stockRowData}
          loading={false}
        />
      </div>
    </Container>
  )
}
