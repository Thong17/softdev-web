import Container from 'components/shared/Container'
import Breadcrumb from 'components/shared/Breadcrumbs'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import { selectStock, getStock } from './redux'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import useLanguage from 'hooks/useLanguage'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ProductInfo } from 'components/shared/ProductInfo'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import { Form } from './Form'
import { initStock } from './constant'

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
  const { data: product, status } = useAppSelector(selectStock)
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const { id } = useParams()
  const [stockDialog, setStockDialog] = useState({
    open: false,
    productId: id,
    stockId: null
  })
  const [stockValue, setStockValue] = useState(initStock)

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
      title: status === 'SUCCESS' ? product?.name?.[lang] || product?.name?.['English'] : '...',
    },
  ]

  useEffect(() => {
    if (status !== 'INIT') return
    if (id) {
      dispatch(getStock({ id }))
    }
  }, [dispatch, status, id])

  const handleAddStock = () => {
    setStockValue(initStock)
    setStockDialog({ ...stockDialog, open: true })
  }

  return (
    <Container header={<Header stages={stockBreadcrumb} styled={theme} onClickAdd={handleAddStock} />}>
      <Form
        dialog={stockDialog}
        setDialog={setStockDialog}
        theme={theme}
        defaultValues={stockValue}
        colors={product?.colors || []}
        properties={product?.properties || []}
        options={product?.options || []}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr', paddingTop: 10 }}>
        <ProductInfo info={product} />
        <div className='stock-list'></div>
      </div>
    </Container>
  )
}
