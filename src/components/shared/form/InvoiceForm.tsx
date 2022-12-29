import useTheme from 'hooks/useTheme'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { CustomButton, CustomInvoiceForm } from 'styles'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { FlexBetween } from '../container/FlexBetween'
import useWeb from 'hooks/useWeb'
import { CustomerStatistic } from '../container/CustomerContainer'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { CircleIcon } from '../table/CustomIcon'
import { MiniDetailField, MiniTextField } from './InputField'
import Button from '../Button'
import { currencyFormat } from 'utils'
import { IOptions, MiniSelectField } from './SelectField'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { transactionSchema } from 'shared/schema'
import { IconButton } from '@mui/material'
import useAlert from 'hooks/useAlert'
import useConfig from 'hooks/useConfig'
import { NotificationLabel } from '../NotificationLabel'
import ComboField from './ComboField'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import EditOffRoundedIcon from '@mui/icons-material/EditOffRounded'
import { CustomerDialog } from 'components/shared/dialog/CustomerDialog'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'

export const currencyOptions: IOptions[] = [
  {
    value: 'USD',
    label: <>&#36;</>,
  },
  {
    value: 'KHR',
    label: <>&#6107;</>,
  },
]

export const discountOptions: IOptions[] = [
  ...currencyOptions,
  {
    value: 'PCT',
    label: <>&#37;</>,
  },
]

export const calculateTransactionTotal = (
  priceObj,
  discountObj,
  quantity,
  exchangeRate
) => {
  const { value: discount, currency: discountCurrency, isFixed } = discountObj
  const { value: price, currency: priceCurrency } = priceObj

  if (!discount || discount === 0) return { total: price * quantity, currency: priceCurrency }

  if (isFixed) {
    if (discountCurrency !== 'PCT') return { total: discount * quantity, currency: discountCurrency }
    else {
      return {
        total: ((price * discount) / 100) * quantity,
        currency: priceCurrency,
      }
    }
  }

  if (discountCurrency === 'PCT')
    return {
      total: (price - (price * discount) / 100) * quantity,
      currency: priceCurrency,
    }
  if (discountCurrency === priceCurrency)
    return { total: (price - discount) * quantity, currency: priceCurrency }

  const { sellRate = 4000, buyRate = 4000 } = exchangeRate
  let totalExchange = 0
  if (discountCurrency === 'USD') {
    totalExchange = discount * buyRate
    return {
      total: (price - totalExchange) * quantity,
      currency: priceCurrency,
    }
  } else {
    totalExchange = discount / sellRate
    return {
      total: (price - totalExchange) * quantity,
      currency: priceCurrency,
    }
  }
}

export const calculatePaymentTotal = (
  subtotal,
  discount,
  tax,
  voucher,
  exchangeRate
) => {
  const {
    value: discountValue,
    type: discountType,
    isFixed: discountFixed,
  } = discount
  const { value: taxValue, type: taxType } = tax
  const {
    value: voucherValue,
    type: voucherType,
    isFixed: voucherFixed,
  } = voucher
  const { sellRate = 4000 } = exchangeRate

  let total = subtotal.USD + subtotal.KHR / sellRate

  const { total: discountedTotal } = calculateTransactionTotal(
    { value: total, currency: 'USD' },
    { value: discountValue, currency: discountType, isFixed: discountFixed },
    1,
    exchangeRate
  )
  const { total: taxedTotal } = calculateTransactionTotal(
    { value: discountedTotal, currency: 'USD' },
    { value: taxValue, currency: taxType, isFixed: false },
    1,
    exchangeRate
  )
  const { total: voucheredTotal } = calculateTransactionTotal(
    { value: discountedTotal + discountedTotal - taxedTotal, currency: 'USD' },
    { value: voucherValue, currency: voucherType, isFixed: voucherFixed },
    1,
    exchangeRate
  )
    
  return voucheredTotal
}

export interface ICurrency {
  value: number
  currency: 'USD' | 'KHR' | 'PCT'
  isFixed?: boolean
}

export interface ITransactionItem {
  id: string | null
  description: string
  discount: ICurrency
  price: ICurrency
  quantity: number
  profile?: string
  note?: string
  total: ICurrency
}

export const recalculatePayment = (paymentId, data) => {
  return new Promise((resolve, reject) => {
    Axios({
      url: `/sale/payment/update/${paymentId}`,
      method: 'PUT',
      body: data
    })
      .then(data => {
        resolve(data?.data?.data)
      })
      .catch(err => reject(err?.response?.data?.msg))
  })
}

export const InvoiceForm = forwardRef(({
  id = null,
  defaultTax = 0,
  transaction,
  onUpdate,
  onUpdateStock,
  onPayment,
  onClear,
  onChangePayment,
  onChangeCustomer,
  listTransactions = []
}: any, ref) => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: transaction,
  })
  const { invoiceBar, toggleInvoiceBar } = useConfig()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const confirm = useAlert()
  const [transactions, setTransactions] = useState<ITransactionItem[]>(listTransactions)
  const [priceCurrency, setPriceCurrency] = useState('')
  const [discountCurrency, setDiscountCurrency] = useState('')
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [isFixed, setIsFixed] = useState(false)
  const discountCurrencyValue = watch('discount.currency')
  const priceCurrencyValue = watch('price.currency')
  const isFixedValue = watch('discount.isFixed')
  const [subtotal, setSubtotal] = useState({ USD: 0, KHR: 0 })
  const [paymentId, setPaymentId] = useState(id)
  const [discount, setDiscount] = useState({
    title: 'Discount',
    value: 0,
    type: 'PCT',
    isFixed: false,
    isEditing: false,
  })
  const [voucher, setVoucher] = useState({
    title: 'Voucher',
    value: 0,
    type: 'PCT',
    isFixed: false,
    isEditing: false,
  })
  const [tax, setTax] = useState({
    title: 'Tax',
    value: defaultTax,
    type: 'PCT',
    isEditing: false,
  })
  const [customerDialog, setCustomerDialog] = useState({ open: false})
  const [customer, setCustomer] = useState({ displayName: null, id: null, point: 0 })
  const { user } = useAuth()
  const exchangeRate = useMemo(() => ({ sellRate: user?.drawer?.sellRate, buyRate: user?.drawer?.buyRate }), [user?.drawer])
  const { notify } = useNotify()

  useEffect(() => {
    setTax(tax => ({ ...tax, value: defaultTax }))
  }, [defaultTax])

  useEffect(() => {
    setPaymentId(id)
  }, [id])

  useImperativeHandle(ref, () => ({
    callClearPayment() {
      onClearPayment()
    }
  }))

  const onClearPayment = () => {
    setPaymentId(null)
    setCustomer({ displayName: null, id: null, point: 0 })
    onChangeCustomer({ displayName: null, id: null, point: 0 })
    setTax({
      title: 'Tax',
      value: defaultTax,
      type: 'PCT',
      isEditing: false,
    })
    setVoucher({
      title: 'Voucher',
      value: 0,
      type: 'PCT',
      isFixed: false,
      isEditing: false,
    })
    setDiscount({
      title: 'Discount',
      value: 0,
      type: 'PCT',
      isFixed: false,
      isEditing: false,
    })
    setSubtotal({ USD: 0, KHR: 0 })
    setTransactions([])
  }

  const handleClearPayment = () => {
    confirm({
      title: 'Are you sure you want to clear the invoice?',
      description: 'Clear the invoice will erase all the transaction.',
      variant: 'error'
    }).then(() => {
      onClear()
    }).catch(() => {})
  }

  useEffect(() => {
    let totalQuantity = 0
    let subtotalUSD = 0
    let subtotalKHR = 0
    transactions.forEach((transaction) => {
      totalQuantity += transaction.quantity
      const { total, currency } = calculateTransactionTotal(
        transaction.price,
        transaction.discount,
        transaction.quantity,
        exchangeRate
      )
      
      if (currency === 'KHR') subtotalKHR += total
      else subtotalUSD += total
    })
    setSubtotal({ USD: subtotalUSD, KHR: subtotalKHR })
    setTotalQuantity(totalQuantity)
  }, [transactions, exchangeRate])

  useEffect(() => {
    if (!transaction) return
    setTransactions((prev) => [...prev, transaction])

    // Uncomment below line to show form on add
    // reset(transaction)
    
    if (!paymentId) return
    recalculatePayment(paymentId, { transaction })
      .then(data => {
        onChangePayment(data)
      })
      .catch(msg => notify(msg, 'error'))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction, reset])

  useEffect(() => {
    setIsFixed(isFixedValue)
  }, [isFixedValue])

  useEffect(() => {
    setPriceCurrency(priceCurrencyValue || 'USD')
  }, [priceCurrencyValue])

  useEffect(() => {
    setDiscountCurrency(discountCurrencyValue || 'PCT')
  }, [discountCurrencyValue])

  const submit = (data) => {
    const id = data.id
    const body = {
      description: data.description,
      discount: data.discount,
      note: data.note,
      price: data.price.value,
      currency: data.price.currency,
      quantity: data.quantity
    }

    Axios({
      method: 'PUT',
      url: `/sale/transaction/update/${id}`,
      body
    }).then((respData) => {
      setTransactions((prev) => prev.map((transaction) => transaction.id === id ? { ...data, total: respData?.data?.data?.total } : transaction))
      onUpdateStock(respData?.data?.stockRemain)
      reset({})
      if (!paymentId) return
      recalculatePayment(paymentId, {})
        .then(data => {
          onChangePayment(data)
        })
        .catch(msg => notify(msg, 'error'))
    }).catch((err) => {
      notify(err?.response?.data?.msg, 'error')
    })
  }

  const handleRemoveTransaction = (event, id) => {
    confirm({
      title: 'Remove Transaction',
      description: 'Are you sure you want to remove this transaction?',
      variant: 'error',
    })
      .then(() => {
        Axios({
          method: 'DELETE',
          url: `/sale/transaction/remove/${id}`,
        }).then((respData) => {
          setTransactions((prev) =>
            prev.filter((transaction) => transaction.id !== id)
          )  
          onUpdateStock(respData?.data?.stockRemain)
          if (!paymentId) return
          recalculatePayment(paymentId, {})
            .then(data => {
              onChangePayment(data)
            })
            .catch(msg => notify(msg, 'error'))
        }).catch((err) => {
          notify(err?.response?.data?.msg, 'error')
        })
      })
      .catch(() => {})
    event.stopPropagation()
  }

  const handleClickTransaction = (transaction) => {
    reset(transaction)
  }

  const handleCancelForm = (event) => {
    reset({})
    event.stopPropagation()
  }

  const toggleDiscountFix = () => {
    setValue('discount.isFixed', !getValues('discount.isFixed'))
  }

  const handleChangeSelect = (event) => {
    setValue(event.target.name, event.target.value)
  }

  const handleChangeDiscount = ({ input, select, check }) => {
    const data = {
      ...discount,
      value: parseFloat(input),
      type: select,
      isFixed: check,
      isEditing: false,
    }
    setDiscount(data)
    if (!paymentId) return
    recalculatePayment(paymentId, { discounts: [data] })
      .then(data => {
        onChangePayment(data)
      })
      .catch(msg => notify(msg, 'error'))   
  }

  const handleChangeTax = ({ input, select }) => {
    const data = { ...tax, value: parseFloat(input), type: select, isEditing: false }
    setTax(data)
    if (!paymentId) return
    recalculatePayment(paymentId, { services: [data] })
      .then(data => {
        onChangePayment(data)
      })
      .catch(msg => notify(msg, 'error'))   
  }

  const handleChangeVoucher = ({ input, select, check }) => {
    const data = {
      ...voucher,
      value: parseFloat(input),
      type: select,
      isFixed: check,
      isEditing: false,
    }
    setVoucher(data)
    if (!paymentId) return
    recalculatePayment(paymentId, { vouchers: [data] })
      .then(data => {
        onChangePayment(data)
      })
      .catch(msg => notify(msg, 'error'))    
  }

  const handleClickPayment = () => {
    onPayment({ transactions, discount, tax, voucher })
  }

  const handleClickCustomer = () => {
    setCustomerDialog({ ...customerDialog, open: true })
  }

  const handleIncreaseQuantity = (event, transactionId) => {
    event.stopPropagation()
    const id = transactionId

    Axios({
      method: 'PUT',
      url: `/sale/transaction/quantity/increase/${id}`,
    }).then((respData) => {
      setTransactions((prev) => prev.map((transaction) => transaction.id === id ? { ...transaction, quantity: respData?.data?.data?.quantity, total: respData?.data?.data?.total } : transaction))
      onUpdateStock(respData?.data?.stockRemain)
      if (!paymentId) return
      recalculatePayment(paymentId, {})
        .then(data => {
          onChangePayment(data)
        })
        .catch(msg => notify(msg, 'error'))
    }).catch((err) => {
      notify(err?.response?.data?.msg, 'error')
    })
  }

  const handleDecreaseQuantity = (event, transactionId) => {
    event.stopPropagation()
    const id = transactionId

    Axios({
      method: 'PUT',
      url: `/sale/transaction/quantity/decrease/${id}`,
    }).then((respData) => {
      setTransactions((prev) => prev.map((transaction) => transaction.id === id ? { ...transaction, quantity: respData?.data?.data?.quantity, total: respData?.data?.data?.total } : transaction))
      onUpdateStock(respData?.data?.stockRemain)
      if (!paymentId) return
      recalculatePayment(paymentId, {})
        .then(data => {
          onChangePayment(data)
        })
        .catch(msg => notify(msg, 'error'))
    }).catch((err) => {
      notify(err?.response?.data?.msg, 'error')
    })
  }

  return (
    <CustomInvoiceForm
      mode={invoiceBar ? 'expand' : 'compact'}
      styled={theme}
      device={device}
    >
      <div>
        <CustomerDialog
          dialog={customerDialog}
          setDialog={setCustomerDialog}
          onClickCustomer={(data) => {
            onChangeCustomer(data)
            setCustomer(data)
          }}
        />
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {device === 'laptop' || device === 'desktop' ? (
            invoiceBar && <CustomerStatistic point={customer.point} phone={customer.displayName} onClick={handleClickCustomer} style={{ marginLeft: 10 }} />
          ) : (
            <CustomerStatistic point={customer.point} phone={customer.displayName} onClick={handleClickCustomer} style={{ marginLeft: 10 }} />
          )}
          <div
            className='toggle'
            style={{ position: 'relative' }}
            onClick={() => toggleInvoiceBar()}
          >
            <ShoppingCartRoundedIcon fontSize='small' />
            {totalQuantity > 0 && <NotificationLabel value={totalQuantity} />}
          </div>
        </div>
        <div className='invoice-form'>
          <div className='form'>
            {transactions.map((transaction, key) => {
              const { value: total, currency } = transaction.total
              if (getValues('id') === transaction.id) {
                return (
                  <div className='item active' key={key}>
                    <div className='item-description'>
                      <div className='profile'>
                        <CircleIcon icon={transaction.profile} />
                      </div>
                      <div className='description'>
                        <span className='main-description'>
                          {transaction.description}
                        </span>
                        <span className='sub-description'>
                          {language['PRICE']}:
                          {currencyFormat(
                            transaction.price?.value,
                            transaction.price?.currency
                          )}
                          <span
                            style={{
                              margin: '0 3px',
                              color: theme.text.quaternary,
                            }}
                          >
                            |
                          </span>
                          <span>{language['QTY']}: {transaction.quantity}</span>
                        </span>
                      </div>
                      <div className='discount'>
                        <span className='main-description'>{language['DISC']}</span>
                        <span className='sub-description'>
                          {currencyFormat(
                            transaction.discount?.value,
                            transaction.discount?.currency
                          )}
                          {transaction.discount?.isFixed && (
                            <span style={{ marginLeft: 3 }}>{language['ONLY']}</span>
                          )}
                        </span>
                      </div>
                      <div className='total'>
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span className='main-description'>{language['TOTAL']}</span>
                          <span className='sub-description'>
                            {currencyFormat(total, currency)}
                          </span>
                        </div>
                        <IconButton
                          style={{ marginLeft: 5 }}
                          onClick={(event) =>
                            handleRemoveTransaction(event, transaction.id)
                          }
                        >
                          <CloseRoundedIcon
                            style={{ fontSize: 17, color: theme.color.error }}
                          />
                        </IconButton>
                      </div>
                    </div>
                    <div className='item-form'>
                      <form
                        onSubmit={handleSubmit(submit)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gridTemplateAreas: `'description description price''quantity discount discount''note note note''action action action'`,
                          gridColumnGap: 20,
                          padding: '10px 0',
                          borderTop: theme.border.dashed,
                          margin: '10px 10px 0 10px',
                        }}
                      >
                        <div style={{ gridArea: 'description' }}>
                          <MiniTextField
                            type='text'
                            label='Description'
                            err={errors?.description?.message}
                            {...register('description')}
                          />
                        </div>
                        <div style={{ gridArea: 'price' }}>
                          <MiniTextField
                            type='number'
                            step='any'
                            label='Price'
                            err={errors?.price?.value?.message}
                            {...register('price.value')}
                            icon={
                              <MiniSelectField
                                options={currencyOptions}
                                err={errors?.price?.currency?.message}
                                name='price.currency'
                                onChange={handleChangeSelect}
                                value={priceCurrency}
                                sx={{
                                  position: 'absolute',
                                  top: -13,
                                  right: -38,
                                  height: 23,
                                  '& .MuiSelect-select': {
                                    position: 'absolute',
                                    top: -2,
                                  },
                                  '& .MuiSvgIcon-root': {
                                    right: 33,
                                  },
                                }}
                              />
                            }
                          />
                        </div>
                        <div style={{ gridArea: 'quantity' }}>
                          <MiniTextField
                            onFocus={(event) => event.target.select()}
                            autoFocus
                            type='number'
                            step='any'
                            label='Quantity'
                            err={errors?.quantity?.message}
                            {...register('quantity')}
                          />
                        </div>
                        <div style={{ gridArea: 'discount' }}>
                          <MiniTextField
                            type='number'
                            step='any'
                            label='Discount'
                            err={errors?.discount?.value?.message}
                            {...register('discount.value')}
                            icon={
                              <>
                                <MiniSelectField
                                  options={discountOptions}
                                  err={errors?.discount?.currency?.message}
                                  name='discount.currency'
                                  onChange={handleChangeSelect}
                                  value={discountCurrency}
                                  sx={{
                                    position: 'absolute',
                                    top: -13,
                                    right: -10,
                                    height: 23,
                                    '& .MuiSelect-select': {
                                      position: 'absolute',
                                      top: -2,
                                    },
                                    '& .MuiSvgIcon-root': {
                                      right: 33,
                                    },
                                  }}
                                />
                                {isFixed ? (
                                  <CheckBoxRoundedIcon
                                    onClick={toggleDiscountFix}
                                    fontSize='small'
                                    style={{
                                      position: 'absolute',
                                      top: -10,
                                      right: 0,
                                      zIndex: 100,
                                    }}
                                  />
                                ) : (
                                  <CheckBoxOutlineBlankRoundedIcon
                                    onClick={toggleDiscountFix}
                                    fontSize='small'
                                    style={{
                                      position: 'absolute',
                                      top: -10,
                                      right: 0,
                                      zIndex: 100,
                                    }}
                                  />
                                )}
                              </>
                            }
                          />
                        </div>
                        <div style={{ gridArea: 'note' }}>
                          <MiniDetailField
                            label='Note'
                            style={{ height: 70 }}
                            {...register('note')}
                          />
                        </div>
                        <div
                          style={{
                            gridArea: 'action',
                            marginTop: 10,
                            display: 'flex',
                            justifyContent: 'end',
                          }}
                        >
                          <Button
                            style={{
                              color: theme.color.error,
                              backgroundColor: `${theme.color.error}22`,
                            }}
                            onClick={handleCancelForm}
                            fullWidth
                          >
                            {language['CANCEL']}
                          </Button>
                          <Button
                            type='submit'
                            style={{
                              marginLeft: 20,
                              color: theme.color.info,
                              backgroundColor: `${theme.color.info}22`,
                            }}
                            fullWidth
                          >
                            {language['SAVE']}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div
                    className='item'
                    key={key}
                    onClick={() => handleClickTransaction(transaction)}
                  >
                    <div className='item-description'>
                      <div className='profile'>
                        <CircleIcon icon={transaction.profile} />
                      </div>
                      <div className='description'>
                        <span className='main-description'>
                          {transaction.description}
                        </span>
                        <span className='sub-description'>
                          {language['PRICE']}:
                          {currencyFormat(
                            transaction.price?.value,
                            transaction.price?.currency
                          )}
                        </span>
                      </div>
                      <div className='quantity'>
                        <span className='main-description'>{language['QTY']}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={(event) => handleDecreaseQuantity(event, transaction.id)} style={{ height: 22, width: 22, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.text.secondary }}>-</IconButton>
                          <span style={{ margin: '0 1px' }}>{transaction.quantity}</span>
                          <IconButton onClick={(event) => handleIncreaseQuantity(event, transaction.id)} style={{ height: 22, width: 22, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.text.secondary }}>+</IconButton>
                        </div>
                      </div>
                      <div className='discount'>
                        <span className='main-description'>{language['DISC']}</span>
                        <span className='sub-description'>
                          {currencyFormat(
                            transaction.discount?.value,
                            transaction.discount?.currency
                          )}
                          {transaction.discount?.isFixed && (
                            <span style={{ marginLeft: 3 }}>{language['ONLY']}</span>
                          )}
                        </span>
                      </div>
                      <div className='total'>
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span className='main-description'>{language['TOTAL']}</span>
                          <span className='sub-description'>
                            {currencyFormat(total, currency)}
                          </span>
                        </div>
                        <IconButton
                          style={{ marginLeft: 5 }}
                          onClick={(event) =>
                            handleRemoveTransaction(event, transaction.id)
                          }
                        >
                          <CloseRoundedIcon
                            style={{ fontSize: 17, color: theme.color.error }}
                          />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </div>
      <div>
        <div className='invoice-total'>
          <div className='total-container'>
            <div className='charge'>
              <div className='item'>
                <span>{language['SUBTOTAL']}</span>
                <div style={{ display: 'flex', lineHeight: 1 }}>
                  <span>
                    {currencyFormat(subtotal.USD + (subtotal.KHR / (user?.drawer?.sellRate || 4000)), 'USD')}
                  </span>
                </div>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span
                  onClick={() =>
                    setDiscount((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                >
                  {language['DISCOUNT']}{' '}
                  {discount.isEditing ? (
                    <EditOffRoundedIcon />
                  ) : (
                    <ModeEditOutlineRoundedIcon />
                  )}
                </span>
                {discount.isEditing ? (
                  <ComboField
                    defaultValue={{ input: discount.value, select: discount.type, check: discount.isFixed }}
                    selectOption={discountOptions}
                    onChange={handleChangeDiscount}
                  />
                ) : (
                  <span
                    onClick={() =>
                      setDiscount((prev) => ({
                        ...prev,
                        isEditing: !prev.isEditing,
                      }))
                    }
                  >
                    -{currencyFormat(discount.value, discount.type)}
                  </span>
                )}
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span
                  onClick={() =>
                    setTax((prev) => ({ ...prev, isEditing: !prev.isEditing }))
                  }
                >
                  {language['TAX']}{' '}
                  {tax.isEditing ? (
                    <EditOffRoundedIcon />
                  ) : (
                    <ModeEditOutlineRoundedIcon />
                  )}
                </span>
                {tax.isEditing ? (
                  <ComboField
                    defaultValue={{ input: tax.value, select: tax.type, check: false }}
                    selectOption={discountOptions}
                    onChange={handleChangeTax}
                    checkbox={false}
                  />
                ) : (
                  <span
                    onClick={() =>
                      setTax((prev) => ({
                        ...prev,
                        isEditing: !prev.isEditing,
                      }))
                    }
                  >
                    +{currencyFormat(tax.value, tax.type)}
                  </span>
                )}
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span
                  onClick={() =>
                    setVoucher((prev) => ({
                      ...prev,
                      isEditing: !prev.isEditing,
                    }))
                  }
                >
                  {language['VOUCHER']}{' '}
                  {voucher.isEditing ? (
                    <EditOffRoundedIcon />
                  ) : (
                    <ModeEditOutlineRoundedIcon />
                  )}
                </span>
                {voucher.isEditing ? (
                  <ComboField
                    defaultValue={{ input: voucher.value, select: voucher.type, check: voucher.isFixed }}
                    selectOption={discountOptions}
                    onChange={handleChangeVoucher}
                  />
                ) : (
                  <span
                    onClick={() =>
                      setVoucher((prev) => ({
                        ...prev,
                        isEditing: !prev.isEditing,
                      }))
                    }
                  >
                    -{currencyFormat(voucher.value, voucher.type)}
                  </span>
                )}
              </div>
            </div>
            <div className='total'>
              <span>{language['TOTAL']}</span>
              <span>
                {currencyFormat(
                  calculatePaymentTotal(subtotal, discount, tax, voucher, exchangeRate),
                  'USD'
                )}
              </span>
            </div>
          </div>
        </div>
        <div className='invoice-payment'>
          <div className='total-container'>
            <div className='total'>
              <FlexBetween>
                <CustomButton
                  styled={theme}
                  fullWidth
                  onClick={handleClearPayment}
                  style={{
                    color: theme.text.secondary,
                    marginRight: 10,
                    borderRadius: theme.radius.secondary,
                  }}
                >
                  {language['CLEAR']}
                </CustomButton>
                <CustomButton
                  styled={theme}
                  fullWidth
                  onClick={handleClickPayment}
                  style={{
                    backgroundColor: `${theme.color.success}22`,
                    color: theme.color.success,
                    borderRadius: theme.radius.secondary,
                  }}
                >
                  {language['PAYMENT']}
                </CustomButton>
              </FlexBetween>
            </div>
          </div>
        </div>
      </div>
    </CustomInvoiceForm>
  )
})
