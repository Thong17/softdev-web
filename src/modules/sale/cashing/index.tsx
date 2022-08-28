import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { InvoiceForm, ITransactionItem } from 'components/shared/form/InvoiceForm'
import useWeb from 'hooks/useWeb'
import { getInfoStore, selectInfoStore } from 'modules/organize/store/redux'
import { useEffect, useState } from 'react'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ProductForm } from './ProductForm'
import { DrawerForm } from './DrawerForm'
import useAuth from 'hooks/useAuth'

export const Cashing = () => {
  const { user } = useAuth()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: preview } = useAppSelector(selectInfoStore)
  const [productDialog, setProductDialog] = useState({ open: false, productId: null })
  const [drawerDialog, setDrawerDialog] = useState({ open: false })
  const { theme } = useTheme()
  const [transaction, setTransaction] = useState<ITransactionItem | null>(null)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    dispatch(getInfoStore())
  }, [dispatch])

  const handleClickProduct = (id) => {
    setProductDialog({ productId: id, open: true })
  }

  const handleAddTransaction = (data) => {
    setReload(!reload)
    setTransaction({
      id: data._id,
      description: data.description,
      discount: { value: data.discount?.value || 0, currency: data.discount?.type || 'PCT', isFixed: data.discount?.isFixed || false },
      price: { value: data.price, currency: data.currency },
      quantity: data.quantity,
      total: data.total
    })
  }

  return (
    <Container>
      <ProductForm
        dialog={productDialog}
        setDialog={setProductDialog}
        addTransaction={handleAddTransaction}
      />
      <DrawerForm
        dialog={drawerDialog}
        setDialog={setDrawerDialog}
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
            toggleReload={reload}
            actions={
              <>
                <IconButton
                  onClick={() => setDrawerDialog({ ...drawerDialog, open: true })}
                  style={{
                    color: user?.drawer?.status ? theme.color.success : theme.color.error,
                    width: 30,
                    height: 30,
                    marginRight: 10,
                  }}
                >
                  <PriceChangeRoundedIcon style={{ fontSize: 23 }} />
                </IconButton>
                <IconButton
                  onClick={() => setReload(!reload)}
                  style={{
                    color: theme.text.secondary,
                    width: 30,
                    height: 30,
                    marginRight: 10,
                  }}
                >
                  <ReplayRoundedIcon style={{ fontSize: 21 }} />
                </IconButton>
              </>
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
            onUpdate={() => setReload(!reload)}
          />
        </div>
      </div>
    </Container>
  )
}
