import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { InvoiceForm } from 'components/shared/form/InvoiceForm'
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
  const [active, setActive] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [productDialog, setProductDialog] = useState({ open: false, productId: null })
  const { theme } = useTheme()

  useEffect(() => {
    dispatch(getInfoStore())
  }, [dispatch])

  const handleClickProduct = (id) => {
    setActive(id)
    setProductDialog({ productId: id, open: true })
  }

  return (
    <Container>
      <ProductForm
        dialog={productDialog}
        setDialog={setProductDialog}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            device === 'mobile' || device === 'tablet' ? '1fr' : '1fr auto',
          gridGap: 30,
          height: 'fit-content',
        }}
      >
        <ProductContainer
          onClickProduct={handleClickProduct}
          filterPromotion={true}
          activeId={active}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <InvoiceForm
            name={preview?.name}
            logo={preview?.logo || 'default.png'}
            tax={preview?.tax}
            font={preview?.font}
            footer={preview?.other}
          />
        </div>
      </div>
    </Container>
  )
}
