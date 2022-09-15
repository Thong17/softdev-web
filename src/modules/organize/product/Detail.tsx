import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductInfo } from 'components/shared/ProductInfo'
import useWeb from 'hooks/useWeb'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { getProduct, selectProduct } from './redux'
import { Section } from 'components/shared/Section'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import { CustomColorContainer, CustomOptionContainer } from 'styles/container'
import { currencyFormat } from 'utils'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'

const Header = () => {
  return (
    <>
      <StoreBreadcrumbs page='productDetail' />
    </>
  )
}

export const DetailProduct = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const { device } = useWeb()
  const { data: product, status } = useAppSelector(selectProduct)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (id) {
      dispatch(getProduct({ id }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: device === 'mobile' ? '1fr' : '400px 1fr',
          gridGap: 20,
        }}
      >
        <div className='preview' style={{ paddingTop: 20 }}>
          <ProductInfo
            info={product}
            loading={status !== 'SUCCESS' ? true : false}
          />
        </div>
        <div>
          {product?.colors?.length > 0 && (
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
                    <div
                      className='color-container'
                      key={index}
                    >
                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: '100%',
                            backgroundColor: color?.code,
                            boxShadow: theme.shadow.inset,
                            borderRadius: 3,
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%',
                            width: 'calc(100% - 7px)',
                            paddingLeft: 10,
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
                          <FlexBetween>
                            <TextEllipsis className='option-price'>
                              {currencyFormat(color.price, color.currency)}
                            </TextEllipsis>
                          </FlexBetween>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CustomColorContainer>
            </Section>
          )}
          {product?.properties?.map((property, key) => {
            if (property.options?.length < 1)
              return <div key={key} style={{ display: 'none' }}></div>

            return (
              <Section
                key={key}
                describe={`${
                  property.name[lang] || property.name['English']
                } (${property.isRequire ? '1 Required' : 'Optional'})`}
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
                        <div
                          key={index}
                          className='option-container'
                        >
                          <div className='option-detail'>
                            <TextEllipsis className='title'>
                              {option.name?.[lang] || option.name?.['English']}
                            </TextEllipsis>
                            <TextEllipsis className='description'>
                              {option.description}
                            </TextEllipsis>
                          </div>
                          <FlexBetween>
                            <TextEllipsis className='option-price'>
                              {currencyFormat(option.price, option.currency)}
                            </TextEllipsis>
                          </FlexBetween>
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
    </Container>
  )
}
