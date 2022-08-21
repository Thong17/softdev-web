import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { InvoiceForm, ITransactionItem } from 'components/shared/form/InvoiceForm'
import useWeb from 'hooks/useWeb'
import { getInfoStore, selectInfoStore } from 'modules/organize/store/redux'
import { useEffect, useState } from 'react'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ProductForm } from './ProductForm'

export const Cashing = () => {
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: preview } = useAppSelector(selectInfoStore)
  const [drawer, setDrawer] = useState(false)
  const [productDialog, setProductDialog] = useState({ open: false, productId: null })
  const { theme } = useTheme()
  const [transaction, setTransaction] = useState<ITransactionItem | null>(null)

  useEffect(() => {
    dispatch(getInfoStore())
  }, [dispatch])

  const handleClickProduct = (id) => {
    setProductDialog({ productId: id, open: true })
  }

  const handleAddTransaction = (data) => {
    setTransaction({
      id: data._id,
      description: data.description,
      discount: { value: data.discount?.value || 0, currency: data.discount?.type || 'PCT', isFixed: data.discount?.isFixed || false },
      price: { value: data.price, currency: data.currency },
      quantity: data.quantity,
    })
  }

  return (
    <Container>
      <ProductForm
        dialog={productDialog}
        setDialog={setProductDialog}
        addTransaction={handleAddTransaction}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            device === 'mobile' || device === 'tablet' ? '1fr' : '1fr auto',
          gridTemplateAreas: device === 'mobile' || device === 'tablet' ? `'invoice invoice''product product'` : `'product invoice'`,
          gridGap: 30,
          height: 'fit-content',
        }}
      >
        <div style={{ gridArea: 'product' }}>
          <ProductContainer
            onClickProduct={handleClickProduct}
            filterPromotion={true}
            actions={
              <IconButton
                onClick={() => setDrawer(!drawer)}
                style={{
                  color: drawer ? theme.color.success : theme.color.error,
                  width: 30,
                  height: 30,
                  marginRight: 10,
                }}
              >
                <PriceChangeRoundedIcon style={{ fontSize: 23 }} />
              </IconButton>
            }
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gridArea: 'invoice'
          }}
        >
          <InvoiceForm
            tax={preview?.tax}
            transaction={transaction}
          />
        </div>
      </div>
    </Container>
  )
}
