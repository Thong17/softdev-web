import { useAppDispatch, useAppSelector } from 'app/hooks'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { ProductInfo } from 'components/shared/ProductInfo'
import { Section } from 'components/shared/Section'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import { getInfoProduct, selectInfoProduct } from 'shared/redux'
import { CustomColorContainer, CustomOptionContainer } from 'styles/container'

export const ProductForm = ({ dialog, setDialog }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { lang } = useLanguage()
  const dispatch = useAppDispatch()
  const { data, status } = useAppSelector(selectInfoProduct)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if (!dialog.productId) return

    dispatch(getInfoProduct(dialog.productId))
  }, [dispatch, dialog.productId])

  useEffect(() => {
    setProduct(data)
  }, [data])
  
  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false, productId: null })
    setProduct(null)
  }

  return (
    <AlertContainer
      justify='start'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          width: 'calc(100vw - 552px)',
          height: '100vh',
          padding: 20,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <div>
          <ProductInfo
            info={product}
            loading={status !== 'SUCCESS' ? true : false}
          />
        </div>
        <div>
          {product?.colors.length > 0 && (
            <Section
              describe='Color'
              style={{
                boxShadow: theme.shadow.secondary,
                borderRadius: theme.radius.ternary,
                marginTop: 20,
              }}
            >
              <CustomColorContainer
                device={device}
                styled={theme}
                loading={'false'}
              >
                {product?.colors?.map((color, index) => {
                  return (
                    <div className='color-container' key={index}>
                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            width: 'calc(100% - 7px)',
                            paddingRight: 10,
                            boxSizing: 'border-box',
                          }}
                        >
                          <div className='option-detail'>
                            <TextEllipsis className='title'>
                              {color?.name?.[lang] || color?.name?.['English']}
                            </TextEllipsis>
                            <TextEllipsis className='description'>
                              {color?.description}
                            </TextEllipsis>
                          </div>
                          <TextEllipsis className='option-price'>
                            {color?.price} {color?.currency}
                          </TextEllipsis>
                        </div>
                        <span
                          style={{
                            width: 7,
                            height: '100%',
                            backgroundColor: color?.code,
                            boxShadow: theme.shadow.inset,
                            borderRadius: 3,
                          }}
                        ></span>
                      </div>
                    </div>
                  )
                })}
              </CustomColorContainer>
            </Section>
          )}
          {product?.properties?.map((property, key) => {
            return (
              <Section
                key={key}
                describe={property.name[lang] || property.name['English']}
                style={{
                  boxShadow: theme.shadow.secondary,
                  borderRadius: theme.radius.ternary,
                  marginTop: 20,
                }}
              >
                <CustomOptionContainer
                  device={device}
                  styled={theme}
                  loading={'false'}
                >
                  {product?.options?.map((option, index) => {
                    return (
                      option.property === property._id && (
                        <div key={index} className='option-container'>
                          <div className='option-detail'>
                            <TextEllipsis className='title'>
                              {option.name?.[lang] || option.name?.['English']}
                            </TextEllipsis>
                            <TextEllipsis className='description'>
                              {option.description}
                            </TextEllipsis>
                          </div>
                          <TextEllipsis className='option-price'>
                            {option.price} {option.currency}
                          </TextEllipsis>
                        </div>
                      )
                    )
                  })}
                </CustomOptionContainer>
              </Section>
            )
          })}
        </div>
      </div>
    </AlertContainer>
  )
}
