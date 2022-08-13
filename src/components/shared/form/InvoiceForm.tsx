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
import { MiniSelectField } from './SelectField'
import { currencyOptions } from 'constants/variables'
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded'
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'

const isValidForm = () => {
  return true
}

const discountOptions = [
  ...currencyOptions,
  {
    value: 'Percent',
    label: 'PCT',
  },
]

export interface ICurrency {
  value: number
  currency: 'USD' | 'KHR' | 'Percent'
  isFixed?: boolean
}

export interface ITransactionItem {
  id: string | null
  body: {
    description: string
    discount: ICurrency
    price: ICurrency
    total: ICurrency
    quantity: number
    profile?: string
    note?: string
  }
}

export const InvoiceForm = ({
  name = 'Shop Name',
  tax = 0,
  font = 'Ariel',
  transaction,
}: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const [toggle, setToggle] = useState(false)
  const [transactions, setTransactions] = useState<ITransactionItem[]>([
    {
      id: '1',
      body: {
        description: 'Macbook Pro 13 inches',
        discount: { value: 20, currency: 'Percent', isFixed: false },
        price: { value: 1333, currency: 'USD' },
        total: { value: 1333, currency: 'USD' },
        quantity: 1,
      },
    },
  ])
  const [form, setForm] = useState<ITransactionItem | null>({
    id: '1',
    body: {
      description: 'Macbook Pro 13 inches',
      discount: { value: 20, currency: 'Percent', isFixed: false },
      price: { value: 1333, currency: 'USD' },
      total: { value: 1333, currency: 'USD' },
      quantity: 1,
    },
  })

  useEffect(() => {
    setForm(transaction)
  }, [transaction])

  const handleSubmit = () => {
    if (!isValidForm() || !form) return
    setTransactions((prevTransactions) => [...prevTransactions, form])
  }

  const handleClickTransaction = (transaction) => {
    setForm(transaction)
  }

  const handleChangeForm = (event) => {
    console.log(event.target)
  }

  const handleCancelForm = (event) => {
    setForm(null)
    event.stopPropagation()
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
                  onClick={() => handleClickTransaction(transaction)}
                >
                  <div className='item-description'>
                    <div className='profile'>
                      <CircleIcon icon={transaction.body?.profile} />
                    </div>
                    <div className='description'>
                      <span className='main-description'>
                        {transaction.body?.description}
                      </span>
                      <span className='sub-description'>
                        Price:{' '}
                        {currencyFormat(
                          transaction.body?.price?.value,
                          transaction.body?.price?.currency
                        )}
                        ,{' '}
                        <span style={{ color: theme.text.tertiary }}>
                          Qty: {transaction.body?.quantity}
                        </span>
                      </span>
                    </div>
                    <div className='discount'>
                      {currencyFormat(
                        transaction.body?.discount?.value,
                        transaction.body?.discount?.currency
                      )}
                    </div>
                    <div className='total'>
                      {currencyFormat(
                        transaction.body?.total?.value,
                        transaction.body?.total?.currency
                      )}
                      <CloseRoundedIcon
                        style={{ fontSize: 17, color: theme.color.error }}
                      />
                    </div>
                  </div>
                  <div className='item-form'>
                    {form?.id === transaction.id && (
                      <form
                        onSubmit={handleSubmit}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gridTemplateAreas: `'description description price''quantity discount discount''note note note''action action action'`,
                          gridColumnGap: 20,
                          padding: 10,
                        }}
                      >
                        <div style={{ gridArea: 'description' }}>
                          <MiniTextField
                            type='text'
                            label='Description'
                            name='description'
                            value={form.body.description}
                            onChange={handleChangeForm}
                          />
                        </div>
                        <div style={{ gridArea: 'price' }}>
                          <MiniTextField
                            type='number'
                            label='Price'
                            name='price'
                            value={form.body.price.value}
                            onChange={handleChangeForm}
                            icon={
                              <MiniSelectField
                                options={currencyOptions}
                                onChange={handleChangeForm}
                                value={form.body.price.currency || 'USD'}
                                sx={{
                                  position: 'absolute',
                                  top: -11,
                                  right: -23,
                                  height: 23,
                                  '& .MuiSelect-select': {
                                    position: 'absolute',
                                    top: -2,
                                  },
                                  '& .MuiSvgIcon-root': {
                                    right: 16
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
                            name='quantity'
                            value={form.body.quantity}
                            onChange={handleChangeForm}
                          />
                        </div>
                        <div style={{ gridArea: 'discount' }}>
                          <MiniTextField
                            type='number'
                            label='Discount'
                            name='discount'
                            value={form.body.discount.value}
                            onChange={handleChangeForm}
                            icon={
                              <>
                                <MiniSelectField
                                  options={discountOptions}
                                  onChange={handleChangeForm}
                                  value={form.body.discount.currency || 'Percent'}
                                  sx={{
                                    position: 'absolute',
                                    top: -11,
                                    right: 5,
                                    height: 23,
                                    '& .MuiSelect-select': {
                                      position: 'absolute',
                                      top: -2,
                                    },
                                    '& .MuiSvgIcon-root': {
                                      right: 16
                                    }
                                  }}
                                />
                                { form.body.discount.isFixed ? <CheckBoxRoundedIcon fontSize='small' style={{ position: 'absolute', top: -10, right: 0, zIndex: 100 }} /> : <CheckBoxOutlineBlankRoundedIcon fontSize='small' style={{ position: 'absolute', top: -10, right: 0, zIndex: 100 }} />}
                              </>
                            }
                          />
                        </div>
                        <div style={{ gridArea: 'note' }}>
                          <MiniDetailField
                            label='Note'
                            name='note'
                            value={form.body.note}
                            style={{ height: 70 }}
                            onChange={handleChangeForm}
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
