import { useAppDispatch, useAppSelector } from 'app/hooks'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { ProductInfo } from 'components/shared/ProductInfo'
import { Section } from 'components/shared/Section'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { useEffect, useState } from 'react'
import {
  clearInfoProduct,
  getInfoProduct,
  selectInfoProduct,
} from 'shared/redux'
import { CustomButton } from 'styles'
import { CustomColorContainer, CustomOptionContainer, CustomCustomerOptionContainer } from 'styles/container'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { IconButton } from '@mui/material'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import { currencyFormat } from 'utils'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import { QuantityStatus } from 'components/shared/QuantityStatus'
import useNotify from 'hooks/useNotify'
import Axios from 'constants/functions/Axios'
import { NanoInput } from 'components/shared/form/InputField'

export const ProductForm = ({ dialog, setDialog, addTransaction }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { notify } = useNotify()
  const { lang, language } = useLanguage()
  const dispatch = useAppDispatch()
  const { data, status } = useAppSelector(selectInfoProduct)
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [productProperties, setProductProperties] = useState<any[]>([])
  const [productOptions, setProductOptions] = useState<any[]>([])
  const [productColor, setProductColor] = useState<any>(undefined)
  const [productCustomerOption, setProductCustomerOption] =
    useState<any>(undefined)
  const [totalOptions, setTotalOptions] = useState(0)
  const [totalColor, setTotalColor] = useState(0)
  const [totalCustomerOption, setTotalCustomerOption] = useState(0)
  const [totalStock, setTotalStock] = useState(0)
  const [totalDescription, setTotalDescription] = useState('')
  const [requireFields, setRequireFields] = useState<any[]>([])

  useEffect(() => {
    let total = 0
    let selectedOptions: any[] = []
    productProperties.forEach((property) => {
      if (property.choice === 'MULTIPLE') {
        return (selectedOptions = [...selectedOptions, ...property.options])
      }

      if (!property.option) return
      return (selectedOptions = [...selectedOptions, property.option])
    })

    product?.stocks?.forEach((stock) => {
      const options = [...stock.options]

      if (
        productColor?._id !== stock.color ||
        selectedOptions.sort().join(',') !== options.sort().join(',')
      )
        return
      total += stock.quantity
    })
    setProductOptions(selectedOptions)
    setTotalStock(total)
  }, [productProperties, productColor, product?.stocks])

  useEffect(() => {
    if (!product) return
    if (product.colors?.length === 0 && product.options?.length === 0 && product.customers?.length === 0) {
      let total = 0
      product?.stocks?.forEach((stock) => {
        total += stock.quantity
      })

      if (quantity < 1)
        return notify('Please select at least 1 quantity', 'error')
      if (product.isStock && quantity > total)
        return notify('Order quantity has exceed our current stock', 'error')

      Axios({
        method: 'POST',
        url: '/sale/transaction/add',
        body: {
          product: product._id,
          description: `${product.name[lang] || product.name['English']}`,
          color: null,
          price: product.price,
          currency: product.currency,
          total: {
            value: product.price * quantity,
            currency: product.currency,
          },
          quantity,
          options: [],
          promotion: product.promotion,
        },
      })
        .then((data) => {
          addTransaction(data?.data?.data, data?.data?.stockRemain)
          setQuantity(1)
          handleCloseDialog()
        })
        .catch((err) => {
          notify(err?.response?.data?.msg, 'error')
        })
    }

    let addedOnPrices: any[] = []
    let description = ''

    Object.keys(productProperties).forEach((key) => {
      const property = productProperties[key]

      if (property.choice === 'MULTIPLE') {
        const options = product.options.filter((opt) => {
          if (!property.options.includes(opt._id)) return false

          description += `${opt.name?.[lang] || opt.name?.['English']} `
          return true
        })

        if (options.length > 0) addedOnPrices.push(...options)
      } else {
        const option = product.options.find((opt) => {
          if (property.option !== opt._id) return false

          description += `${opt.name?.[lang] || opt.name?.['English']} `
          return true
        })

        if (option) addedOnPrices.push(option)
      }
    })

    let total = product.price
    addedOnPrices.forEach((opt) => {
      let price = opt.price
      if (opt.currency !== product.currency) {
        if (product.currency === 'KHR') price *= 4000
        else price /= 4000
      }
      total += price
    })
    setTotalOptions(total)
    setTotalDescription(description)
    // eslint-disable-next-line
  }, [productProperties, product, lang])

  useEffect(() => {
    if (!dialog.productId) return

    dispatch(getInfoProduct(dialog.productId))
  }, [dispatch, dialog.productId])

  useEffect(() => {
    if (!data) return

    setProduct(data)
    let selectedProperty: any[] = []
    data.properties?.forEach((property) => {
      let optionValue = null
      let optionValues: any[] = []

      data?.options?.forEach((option) => {
        if (option.isDefault && option.property === property._id) {
          if (property.choice !== 'SINGLE') {
            optionValues = [...optionValues, option._id]
          } else {
            optionValue = option._id
          }
        }
      })

      selectedProperty.push({
        id: property._id,
        isRequire: property.isRequire,
        choice: property.choice,
        [property.choice === 'SINGLE' ? 'option' : 'options']:
          property.choice === 'SINGLE' ? optionValue : optionValues,
      })
    })
    setProductProperties(selectedProperty)
    if (data.colors?.length > 0 || data.options?.length > 0 || data.customers?.length > 0)
      setDialog({ ...dialog, open: true })
    // eslint-disable-next-line
  }, [data])

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false, productId: null })
    setProduct(null)
    dispatch(clearInfoProduct())
  }

  const handleChangeQuantity = (event) => {
    let value = event.target.value
    setQuantity(value)
  }

  const handleClickColor = (id) => {
    const color = product?.colors.find((color) => color._id === id)

    if (!id) return
    let price = color.price
    if (color.currency !== product.currency) {
      if (product.currency === 'KHR') price *= 4000
      else price /= 4000
    }
    setTotalColor(price)
    setProductColor(color)
  }

  const handleCancelColor = () => {
    setProductColor(undefined)
    setTotalColor(0)
  }

  const handleClickCustomerOption = (id) => {
    const customer = product?.customers.find((customer) => customer._id === id)

    if (!id) return
    let price = customer.price
    if (customer.currency !== product.currency) {
      if (product.currency === 'KHR') price *= 4000
      else price /= 4000
    }
    setTotalCustomerOption(price)
    setProductCustomerOption(customer)
  }

  const handleCancelCustomerOption = () => {
    setProductCustomerOption(undefined)
    setTotalCustomerOption(0)
  }

  const handleClickOption = (optionId, propId, choice) => {
    setProductProperties((prev) => {
      const prop = prev.find((prop) => prop.id === propId)
      let key = choice !== 'SINGLE' ? 'options' : 'option'
      let value = choice !== 'SINGLE' ? [...prop.options, optionId] : optionId

      setRequireFields((fields) => fields.filter((field) => field !== prop.id))
      return prev.map((prop) =>
        prop.id !== propId ? prop : { ...prop, [key]: value }
      )
    })
  }

  const handleCancelOption = (optionId, propId, choice) => {
    setProductProperties((prev) => {
      const prop = prev.find((prop) => prop.id === propId)
      let key = choice !== 'SINGLE' ? 'options' : 'option'
      let value =
        choice !== 'SINGLE'
          ? prop.options.filter((option) => option !== optionId)
          : null

      return prev.map((prop) =>
        prop.id !== propId ? prop : { ...prop, [key]: value }
      )
    })
  }

  const handleAddToCart = () => {
    let isError = false
    productProperties?.forEach((property) => {
      if (property.isRequire) {
        if (property.choice === 'MULTIPLE' && property.options.length < 1) {
          setRequireFields((prev) => [...prev, property.id])
          return (isError = true)
        }
        if (property.choice === 'SINGLE' && !property.option) {
          setRequireFields((prev) => [...prev, property.id])
          return (isError = true)
        }
      }
    })
    if (isError) return notify(`Option is required`, 'error')
    if (quantity < 1)
      return notify('Please select at least 1 quantity', 'error')
    if (product.isStock && quantity > totalStock)
      return notify('Order quantity has exceed our current stock', 'error')

    Axios({
      method: 'POST',
      url: '/sale/transaction/add',
      body: {
        product: product._id,
        description: `${product.name[lang] || product.name['English']} ${
          productColor?.name[lang] || productColor?.name['English'] || ''
        } ${totalDescription}`,
        color: productColor?._id,
        price: totalOptions + totalColor + totalCustomerOption,
        currency: product?.currency,
        total: {
          value: (totalOptions + totalColor + totalCustomerOption) * quantity,
          currency: product?.currency,
        },
        quantity,
        options: productOptions,
        customer: productCustomerOption?._id,
        promotion: product.promotion,
      },
    })
      .then((data) => {
        addTransaction(data?.data?.data, data?.data?.stockRemain)
        handleCloseDialog()
        setProductColor(undefined)
        setProductCustomerOption(undefined)
        setTotalColor(0)
        setTotalCustomerOption(0)
        setQuantity(1)
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  return (
    <AlertContainer
      justify='start'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          width:
            device === 'mobile' || device === 'tablet'
              ? 'calc(100vw - 62px)'
              : 'calc(100vw - 552px)',
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
          {product?.customers?.length > 0 && (
            <Section
              describe={language['CUSTOMER']}
              style={{
                boxShadow: theme.shadow.secondary,
                borderRadius: theme.radius.ternary,
                marginTop: 20,
              }}
            >
              <CustomCustomerOptionContainer
                device={device}
                styled={theme}
                loading={'false'}
              >
                {product?.customers?.map((customer, index) => {
                  return (
                    <div
                      className='color-container'
                      key={index}
                      onClick={() =>
                        productCustomerOption?._id === customer._id
                          ? handleCancelCustomerOption()
                          : handleClickCustomerOption(customer._id)
                      }
                      style={{
                        border:
                          customer._id === productCustomerOption?._id
                            ? `1px solid ${theme.color.info}`
                            : theme.border.quaternary,
                        cursor: 'pointer',
                      }}
                    >
                      <div className='select'>
                        {customer._id === productCustomerOption?._id && (
                          <DoneAllRoundedIcon
                            fontSize='small'
                            style={{ color: theme.color.info }}
                          />
                        )}
                      </div>
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
                            paddingLeft: 10,
                            boxSizing: 'border-box',
                          }}
                        >
                          <div className='option-detail'>
                            <TextEllipsis className='title'>
                              {customer?.name?.[lang] ||
                                customer?.name?.['English']}
                            </TextEllipsis>
                            <TextEllipsis className='description'>
                              {customer?.description}
                            </TextEllipsis>
                          </div>
                          <FlexBetween>
                            <TextEllipsis className='option-price'>
                              {currencyFormat(
                                customer.price,
                                customer.currency
                              )}
                            </TextEllipsis>
                          </FlexBetween>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CustomCustomerOptionContainer>
            </Section>
          )}
          {product?.colors.length > 0 && (
            <Section
              describe={language['COLOR']}
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
                  let totalStock = 0
                  product?.stocks?.forEach((stock) => {
                    if (stock.color !== color._id) return
                    let selectedOptions = [...productOptions]
                    let stockOptions = [...stock.options]

                    const matchedOptions = stockOptions.filter((opt) =>
                      selectedOptions.includes(opt)
                    )
                    if (
                      selectedOptions.length > 0 &&
                      matchedOptions.sort().join(',') !==
                        selectedOptions.sort().join(',')
                    )
                      return
                    if (productColor && stock.color !== productColor?._id)
                      return

                    totalStock += stock.quantity
                  })
                  return (
                    <div
                      className='color-container'
                      key={index}
                      onClick={() =>
                        productColor?._id === color._id
                          ? handleCancelColor()
                          : handleClickColor(color._id)
                      }
                      style={{
                        border:
                          color._id === productColor?._id
                            ? `1px solid ${theme.color.info}`
                            : theme.border.quaternary,
                        cursor: 'pointer',
                      }}
                    >
                      <div className='select'>
                        {color._id === productColor?._id && (
                          <DoneAllRoundedIcon
                            fontSize='small'
                            style={{ color: theme.color.info }}
                          />
                        )}
                      </div>
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
                            <TextEllipsis>
                              {product?.isStock && (
                                <QuantityStatus qty={totalStock} min={1} />
                              )}
                            </TextEllipsis>
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
            const selectedProperty = productProperties.find(
              (prop) => prop.id === property._id
            )

            return (
              <Section
                key={key}
                err={requireFields.includes(property._id)}
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
                    const selected =
                      property.choice === 'SINGLE'
                        ? selectedProperty?.option === option._id
                        : selectedProperty?.options?.includes(option._id)

                    let totalStock = 0
                    product?.stocks?.forEach((stock) => {
                      if (!stock.options.includes(option._id)) return
                      let selectedOptions = [...productOptions]
                      let stockOptions = [...stock.options]

                      const matchedOptions = stockOptions.filter((opt) =>
                        selectedOptions.includes(opt)
                      )
                      if (
                        selectedOptions.length > 0 &&
                        matchedOptions.sort().join(',') !==
                          selectedOptions.sort().join(',')
                      )
                        return
                      if (productColor && stock.color !== productColor?._id)
                        return

                      totalStock += stock.quantity
                    })

                    return (
                      option.property === property._id && (
                        <div
                          onClick={() =>
                            selected
                              ? handleCancelOption(
                                  option._id,
                                  property._id,
                                  property.choice
                                )
                              : handleClickOption(
                                  option._id,
                                  property._id,
                                  property.choice
                                )
                          }
                          key={index}
                          className='option-container'
                          style={{
                            border: selected
                              ? `1px solid ${theme.color.info}`
                              : theme.border.quaternary,
                            cursor: 'pointer',
                          }}
                        >
                          <div className='select'>
                            {selected && (
                              <DoneAllRoundedIcon
                                fontSize='small'
                                style={{ color: theme.color.info }}
                              />
                            )}
                          </div>
                          <div className='option-detail'>
                            <TextEllipsis className='title'>
                              {option.name?.[lang] || option.name?.['English']}
                            </TextEllipsis>
                            <TextEllipsis className='description'>
                              {option.description}
                            </TextEllipsis>
                          </div>
                          <FlexBetween>
                            <TextEllipsis>
                              {product?.isStock && (
                                <QuantityStatus qty={totalStock} min={1} />
                              )}
                            </TextEllipsis>
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
      <div style={{ padding: 10 }}>
        <div
          style={{
            backgroundColor: `${theme.background.secondary}99`,
            boxShadow: theme.shadow.secondary,
            display: 'flex',
            alignItems: 'center',
            borderRadius: theme.radius.ternary,
            padding: 10,
          }}
        >
          <div
            style={{
              width: '50%',
              marginRight: 10,
              padding: '0 20px',
              height: 36.5,
              display: 'flex',
              alignItems: 'center',
              borderRadius: theme.radius.secondary,
              justifyContent: 'space-between',
              backgroundColor: `${theme.background.primary}99`,
              boxSizing: 'border-box',
            }}
          >
            {!product?.isStock ? (
              <span>{language['AVAILABLE']}</span>
            ) : (
              <span>
                {totalStock} {language['AVAILABLE']}
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                <RemoveRoundedIcon
                  style={{ fontSize: 16, color: theme.text.secondary }}
                />
              </IconButton>
              <NanoInput
                value={quantity}
                onChange={handleChangeQuantity}
                placeholder={language['QTY']}
                type='number'
                step='any'
                name='qty'
                id='qty'
                min='1'
              />
              <IconButton
                onClick={() =>
                  setQuantity((prev) =>
                    typeof prev === 'string'
                      ? parseInt(prev || 1) + 1
                      : prev + 1
                  )
                }
              >
                <AddRoundedIcon
                  style={{ fontSize: 16, color: theme.text.secondary }}
                />
              </IconButton>
            </div>
            <span>
              {language['TOTAL']}{' '}
              {currencyFormat(
                (totalOptions + totalColor + totalCustomerOption) * quantity,
                product?.currency
              )}
            </span>
          </div>
          <div style={{ width: '50%', display: 'flex' }}>
            <CustomButton
              styled={theme}
              style={{
                backgroundColor: `${theme.color.error}22`,
                color: theme.color.error,
                marginRight: 10,
                borderRadius: theme.radius.secondary,
              }}
              onClick={handleCloseDialog}
              fullWidth
            >
              {language['CANCEL']}
            </CustomButton>
            <CustomButton
              onClick={handleAddToCart}
              styled={theme}
              style={{
                backgroundColor: `${theme.color.info}22`,
                color: theme.color.info,
                borderRadius: theme.radius.secondary,
              }}
              fullWidth
            >
              {language['ADD_TO_CART']}
            </CustomButton>
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
