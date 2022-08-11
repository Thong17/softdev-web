import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { InvoiceForm } from 'components/shared/form/InvoiceForm'
import useWeb from 'hooks/useWeb'
import { getInfoStore, selectInfoStore } from 'modules/organize/store/redux'
import { useEffect } from 'react'

export const Cashing = () => {
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: preview, status } = useAppSelector(selectInfoStore)

  useEffect(() => {
    dispatch(getInfoStore())
  }, [dispatch])

  const handleClickProduct = (id) => {
    console.log(id)
  }

  return (
    <Container>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            device === 'mobile' || device === 'tablet' ? '1fr' : '1fr 450px',
          gridGap: 30,
          height: 'fit-content',
        }}
      >
        <ProductContainer onClickProduct={handleClickProduct} filterPromotion={true} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {status === 'SUCCESS' && (
            <InvoiceForm
              name={preview?.name}
              logo={preview?.logo || 'default.png'}
              tax={preview?.tax}
              font={preview?.font}
              footer={preview?.other}
            />
          )}
        </div>
      </div>
    </Container>
  )
}
