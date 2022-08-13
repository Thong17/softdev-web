import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { CustomButton, CustomInvoiceForm } from 'styles'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import { FlexBetween } from '../container/FlexBetween'
import useWeb from 'hooks/useWeb'
import { CustomerContainer } from '../container/CustomerContainer'
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
    value: 'Percent',
    label: <>&#37;</>,
  },
]

export const calculateTotal = (priceObj, discountObj, quantity, exchangeRate) => {
  const { value: discount, currency: discountCurrency, isFixed } = discountObj
  const { value: price, currency: priceCurrency } = priceObj
  if (!discount || discount === 0) return currencyFormat(price * quantity, priceCurrency)

  if (isFixed) {
    if (discountCurrency !== 'Percent') return currencyFormat(discount * quantity, discountCurrency)
    return currencyFormat(price * discount / 100 * quantity, priceCurrency)
  }

  if (discountCurrency === 'Percent') return currencyFormat((price - (price * discount / 100)) * quantity, priceCurrency)
  if (discountCurrency === priceCurrency) return currencyFormat((price - discount) * quantity, priceCurrency)
  
  const { sellRate = 4000, buyRate = 4100 } = exchangeRate
  let totalExchange = 0
  if (discountCurrency === 'USD') {
    totalExchange = discount * sellRate
    return currencyFormat((price - totalExchange) * quantity, priceCurrency)
  } else {
    totalExchange = discount / buyRate
    return currencyFormat((price - totalExchange) * quantity, priceCurrency)
  }
}

export interface ICurrency {
  value: number
  currency: 'USD' | 'KHR' | 'Percent'
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
  name = 'Shop Name',
  tax = 0,
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
  } = useForm({ resolver: yupResolver(transactionSchema), defaultValues: transaction })
  const { theme } = useTheme()
  const { device } = useWeb()
  const [toggle, setToggle] = useState(false)
  const [transactions, setTransactions] = useState<ITransactionItem[]>([
    {
      id: '1',
      description: 'Macbook Pro 13 inches',
      discount: { value: 20, currency: 'Percent', isFixed: true },
      price: { value: 1333, currency: 'USD' },
      quantity: 1,
    },
  ])
  const [priceCurrency, setPriceCurrency] = useState('')
  const [discountCurrency, setDiscountCurrency] = useState('')
  const [isFixed, setIsFixed] = useState(false)
  const discountCurrencyValue = watch('discount.currency')
  const priceCurrencyValue = watch('price.currency')
  const isFixedValue = watch('discount.isFixed')

  useEffect(() => {
    setIsFixed(isFixedValue)
  }, [isFixedValue])

  useEffect(() => {
    setPriceCurrency(priceCurrencyValue || 'USD')
  }, [priceCurrencyValue])
  
  useEffect(() => {
    setDiscountCurrency(discountCurrencyValue || 'Percent')
  }, [discountCurrencyValue])
  

  const submit = (data) => {
    setTransactions((prevTransactions) => prevTransactions.map((transaction) => transaction.id === data.id ? data : transaction))
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

  return (
    <CustomInvoiceForm
      mode={toggle ? 'expand' : 'compact'}
      styled={theme}
      device={device}
      font={font}
    >
      <div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {toggle && <CustomerContainer style={{ marginLeft: 10 }} />}
          <div className='toggle' onClick={() => setToggle(!toggle)}>
            <ShoppingCartRoundedIcon fontSize='small' />
          </div>
        </div>
        <div className='invoice-form'>
          <div className='form'>
            {transactions.map((transaction, key) => {
              return (
                <div
                  className='item'
                  key={key}
                  onClick={() => {
                    getValues('id') !== transaction.id && handleClickTransaction(transaction)
                  }}
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
                        {' '}|{' '}
                        <span>
                          Qty: {transaction.quantity}
                        </span>
                      </span>
                    </div>
                    <div className='discount'>
                      <span className='main-description'>Disc</span>
                      <span className='sub-description'>
                        {transaction.discount?.isFixed ? '' : '-'}
                        {currencyFormat(
                          transaction.discount?.value,
                          transaction.discount?.currency
                        )}
                      </span>
                    </div>
                    <div className='total'>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className='main-description'>Total</span>
                        <span className='sub-description'>{calculateTotal(transaction.price, transaction.discount, transaction.quantity, {})}</span>
                      </div>
                      <CloseRoundedIcon
                        style={{ fontSize: 17, color: theme.color.error }}
                      />
                    </div>
                  </div>
                  <div className='item-form'>
                    {getValues('id') === transaction.id && (
                      <form
                        onSubmit={handleSubmit(submit)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gridTemplateAreas: `'description description price''quantity discount discount''note note note''action action action'`,
                          gridColumnGap: 20,
                          padding: '10px 0',
                          borderTop: theme.border.dashed,
                          margin: '10px 10px 0 10px'
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
                                  top: -11,
                                  right: -38,
                                  height: 23,
                                  '& .MuiSelect-select': {
                                    position: 'absolute',
                                    top: -2,
                                  },
                                  '& .MuiSvgIcon-root': {
                                    right: 33
                                  }
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
                                    top: -11,
                                    right: -10,
                                    height: 23,
                                    '& .MuiSelect-select': {
                                      position: 'absolute',
                                      top: -2,
                                    },
                                    '& .MuiSvgIcon-root': {
                                      right: 33
                                    }
                                  }}
                                />
                                {isFixed ? <CheckBoxRoundedIcon onClick={toggleDiscountFix} fontSize='small' style={{ position: 'absolute', top: -10, right: 0, zIndex: 100 }} /> : <CheckBoxOutlineBlankRoundedIcon onClick={toggleDiscountFix} fontSize='small' style={{ position: 'absolute', top: -10, right: 0, zIndex: 100 }} />}
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
                            variant='contained'
                            color='error'
                            onClick={handleCancelForm}
                          >
                            Cancel
                          </Button>
                          <Button
                            type='submit'
                            variant='contained'
                            color='success'
                            style={{ marginLeft: 20 }}
                          >
                            Save
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )
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
                <span>20.00$</span>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Discount</span>
                <span>-20%</span>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Tax</span>
                <span>+10%</span>
              </div>
              <div
                className='item'
                style={{
                  color: theme.text.quaternary,
                  fontSize: theme.responsive[device]?.text.quaternary,
                }}
              >
                <span>Voucher</span>
                <span>-10%</span>
              </div>
            </div>
            <div className='total'>
              <span>Total</span>
              <span>20.00$</span>
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
                  style={{
                    backgroundColor: `${theme.color.info}22`,
                    color: theme.color.info,
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
