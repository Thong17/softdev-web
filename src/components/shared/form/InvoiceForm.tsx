import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
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

const currencyOptions: IOptions[] = [
  {
    value: 'USD',
    label: <>&#36;</>,
  },
  {
    value: 'KHR',
    label: <>&#6107;</>,
  },
]

const discountOptions: IOptions[] = [
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

  if (!discount || discount === 0)
    return { total: price * quantity, currency: priceCurrency }

  if (isFixed) {
    if (discountCurrency !== 'PCT')
      return { total: discount * quantity, currency: discountCurrency }
    return {
      total: ((price * discount) / 100) * quantity,
      currency: priceCurrency,
    }
  }

  if (discountCurrency === 'PCT')
    return {
      total: (price - (price * discount) / 100) * quantity,
      currency: priceCurrency,
    }
  if (discountCurrency === priceCurrency)
    return { total: (price - discount) * quantity, currency: priceCurrency }

  const { sellRate = 4000, buyRate = 4100 } = exchangeRate
  let totalExchange = 0
  if (discountCurrency === 'USD') {
    totalExchange = discount * sellRate
    return {
      total: (price - totalExchange) * quantity,
      currency: priceCurrency,
    }
  } else {
    totalExchange = discount / buyRate
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
  const { buyRate = 4100 } = exchangeRate

  let total = subtotal.USD + subtotal.KHR / buyRate

  const { total: discountedTotal } = calculateTransactionTotal(
    { value: total, currency: 'USD' },
    { value: discountValue, currency: discountType, isFixed: discountFixed },
    1,
    {}
  )
  const { total: taxedTotal } = calculateTransactionTotal(
    { value: discountedTotal, currency: 'USD' },
    { value: taxValue, currency: taxType, isFixed: false },
    1,
    {}
  )
  const { total: voucheredTotal } = calculateTransactionTotal(
    { value: discountedTotal + discountedTotal - taxedTotal, currency: 'USD' },
    { value: voucherValue, currency: voucherType, isFixed: voucherFixed },
    1,
    {}
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
}

export const InvoiceForm = ({
  defaultTax = 0,
  font = 'Ariel',
  transaction,
}: any) => {
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
  const confirm = useAlert()
  const [transactions, setTransactions] = useState<ITransactionItem[]>([])
  const [priceCurrency, setPriceCurrency] = useState('')
  const [discountCurrency, setDiscountCurrency] = useState('')
  const [totalQuantity, setTotalQuantity] = useState(0)
  const [isFixed, setIsFixed] = useState(false)
  const discountCurrencyValue = watch('discount.currency')
  const priceCurrencyValue = watch('price.currency')
  const isFixedValue = watch('discount.isFixed')
  const [subtotal, setSubtotal] = useState({ USD: 0, KHR: 0 })
  const [discount, setDiscount] = useState({
    value: 0,
    type: 'PCT',
    isFixed: false,
    isEditing: false,
  })
  const [voucher, setVoucher] = useState({
    value: 0,
    type: 'PCT',
    isFixed: false,
    isEditing: false,
  })
  const [tax, setTax] = useState({
    value: defaultTax,
    type: 'PCT',
    isEditing: false,
  })
  const [customerDialog, setCustomerDialog] = useState({ open: false})
  const [customer, setCustomer] = useState({ phone: null, id: null, point: 0 })

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
        {}
      )
      if (currency === 'KHR') subtotalKHR += total
      else subtotalUSD += total
    })
    setSubtotal({ USD: subtotalUSD, KHR: subtotalKHR })
    setTotalQuantity(totalQuantity)
  }, [transactions])

  useEffect(() => {
    if (!transaction) return
    setTransactions((prev) => [...prev, transaction])
    reset(transaction)
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
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === data.id ? data : transaction
      )
    )
    reset({})
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

  const handleRemoveTransaction = (event, id) => {
    confirm({
      title: 'Remove Transaction',
      description: 'Are you sure you want to remove this transaction?',
      variant: 'error',
    })
      .then(() => {
        setTransactions((prev) =>
          prev.filter((transaction) => transaction.id !== id)
        )
      })
      .catch(() => {})
    event.stopPropagation()
  }

  const handleChangeDiscount = ({ input, select, check }) => {
    setDiscount({
      value: parseFloat(input),
      type: select,
      isFixed: check,
      isEditing: false,
    })
  }

  const handleChangeTax = ({ input, select }) => {
    setTax({ value: parseFloat(input), type: select, isEditing: false })
  }

  const handleChangeVoucher = ({ input, select, check }) => {
    setVoucher({
      value: parseFloat(input),
      type: select,
      isFixed: check,
      isEditing: false,
    })
  }

  const handleClickPayment = () => {
    console.log({ transactions }, { discount }, { tax }, { voucher }, { customer })
  }

  const handleClickCustomer = () => {
    setCustomerDialog({ ...customerDialog, open: true })
  }

  return (
    <CustomInvoiceForm
      mode={invoiceBar ? 'expand' : 'compact'}
      styled={theme}
      device={device}
      font={font}
    >
      <div>
        <CustomerDialog
          dialog={customerDialog}
          setDialog={setCustomerDialog}
          onClickCustomer={(data) => setCustomer(data)}
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
            invoiceBar && <CustomerStatistic point={customer.point} phone={customer.phone} onClick={handleClickCustomer} style={{ marginLeft: 10 }} />
          ) : (
            <CustomerStatistic point={customer.point} phone={customer.phone} onClick={handleClickCustomer} style={{ marginLeft: 10 }} />
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
              const { total, currency } = calculateTransactionTotal(
                transaction.price,
                transaction.discount,
                transaction.quantity,
                {}
              )
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
                          Price:
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
                          <span>Qty: {transaction.quantity}</span>
                        </span>
                      </div>
                      <div className='discount'>
                        <span className='main-description'>Disc</span>
                        <span className='sub-description'>
                          {currencyFormat(
                            transaction.discount?.value,
                            transaction.discount?.currency
                          )}
                          {transaction.discount?.isFixed && (
                            <span style={{ marginLeft: 3 }}>Only</span>
                          )}
                        </span>
                      </div>
                      <div className='total'>
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span className='main-description'>Total</span>
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
                            type='number'
                            label='Quantity'
                            err={errors?.quantity?.message}
                            {...register('quantity')}
                          />
                        </div>
                        <div style={{ gridArea: 'discount' }}>
                          <MiniTextField
                            type='number'
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
                            Cancel
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
                            Save
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
                          Price:
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
                          <span>Qty: {transaction.quantity}</span>
                        </span>
                      </div>
                      <div className='discount'>
                        <span className='main-description'>Disc</span>
                        <span className='sub-description'>
                          {currencyFormat(
                            transaction.discount?.value,
                            transaction.discount?.currency
                          )}
                          {transaction.discount?.isFixed && (
                            <span style={{ marginLeft: 3 }}>Only</span>
                          )}
                        </span>
                      </div>
                      <div className='total'>
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <span className='main-description'>Total</span>
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
                <span>Subtotal</span>
                <div style={{ display: 'flex', lineHeight: 1 }}>
                  <span>
                    {currencyFormat(subtotal.USD + subtotal.KHR / 4000, 'USD')}
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
                  Discount{' '}
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
                  Tax{' '}
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
                  Voucher{' '}
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
              <span>Total</span>
              <span>
                {currencyFormat(
                  calculatePaymentTotal(subtotal, discount, tax, voucher, {}),
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
                  style={{
                    color: theme.text.secondary,
                    marginRight: 10,
                    borderRadius: theme.radius.secondary,
                  }}
                >
                  Clear
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
                  Payment
                </CustomButton>
              </FlexBetween>
            </div>
          </div>
        </div>
      </div>
    </CustomInvoiceForm>
  )
}
