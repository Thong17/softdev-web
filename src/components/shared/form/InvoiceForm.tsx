import useTheme from 'hooks/useTheme'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { CustomButton, CustomInvoiceForm, CustomMenu } from 'styles'
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
import { IconButton, MenuItem } from '@mui/material'
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
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import ReceiptDialog from '../dialog/ReceiptDialog'
import { getStore, selectStore } from 'modules/organize/store/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import { tableOptions } from 'constants/variables'

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

  let total = subtotal.USD + (subtotal.KHR / sellRate)

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
  product?: string
  description: string
  discount: ICurrency
  price: ICurrency
  quantity: number
  profile?: string
  note?: string
  total: ICurrency
  hasThermalPrinting?: boolean
  options?: any[]
  // Quotation items: which stock to take when converted to cashing
  color?: string | null
  customerOption?: string | null
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
  onCheckout,
  onClear,
  onChangePayment,
  onChangeCustomer,
  listTransactions = [],
  table,
  setTable,
  disableForm = false,
  invoice = null,
  // `quotation` keeps items in local state only (no transaction API calls, so
  // stock is never touched) and swaps the checkout buttons for save/export
  mode = 'payment',
  onSave,
  onExportExcel,
  onExportPdf,
}: any, ref) => {
  const isQuotation = mode === 'quotation'
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
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { data, status } = useAppSelector(selectStore)
  const { invoiceBar, toggleInvoiceBar } = useConfig()
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
  const [checkoutId, setCheckoutId] = useState(id)
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
  const [receiptDialog, setReceiptDialog] = useState<{ open: boolean; listTransactions: ITransactionItem[], payment: any }>({open: false, listTransactions: [], payment: null});
  const [customer, setCustomer] = useState({ displayName: null, id: null, fullName: null, address: null, point: 0 })
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
    },
    // Shows a saved quotation for editing (quotation mode)
    loadQuotation(data) {
      applyCustomer(data.customer)
      setTransactions(
        (data.items || []).map((item) => ({
          id: item._id,
          product: item.product,
          description: item.description,
          price: { value: item.price, currency: item.currency },
          discount: {
            value: item.discount?.value || 0,
            currency: item.discount?.type || 'PCT',
            isFixed: item.discount?.isFixed || false,
          },
          quantity: item.quantity,
          total: item.total,
          note: item.note,
          profile: item.profile,
          color: item.color,
          options: item.options,
          customerOption: item.customerOption,
        }))
      )
      applyAdjustments(data)
    },
    // Fills the cart with existing cart items, e.g. converted from a quotation
    loadCart({ transactions, customer, discounts, services, vouchers }) {
      applyCustomer(customer)
      setTransactions(transactions)
      applyAdjustments({ discounts, services, vouchers })
    },
    getQuotationData() {
      return getQuotationData()
    },
  }))

  const applyCustomer = (data) => {
    const customerData = data
      ? {
          displayName: data.displayName,
          id: data._id,
          fullName: data.fullName,
          address: data.address,
          point: data.point || 0,
        }
      : { displayName: null, id: null, fullName: null, address: null, point: 0 }
    setCustomer(customerData)
    onChangeCustomer(customerData)
  }

  // The invoice-level discount, tax and voucher
  const applyAdjustments = ({ discounts, services, vouchers }) => {
    const [savedDiscount] = discounts || []
    const [savedTax] = services || []
    const [savedVoucher] = vouchers || []
    if (savedDiscount) setDiscount({ title: 'Discount', value: savedDiscount.value || 0, type: savedDiscount.type || 'PCT', isFixed: savedDiscount.isFixed || false, isEditing: false })
    if (savedTax) setTax({ title: 'Tax', value: savedTax.value || 0, type: savedTax.type || 'PCT', isEditing: false })
    if (savedVoucher) setVoucher({ title: 'Voucher', value: savedVoucher.value || 0, type: savedVoucher.type || 'PCT', isFixed: savedVoucher.isFixed || false, isEditing: false })
  }

  // Quotation items are recalculated locally with the same rule the cart uses
  const calculateItemTotal = (item) => {
    const { total, currency } = calculateTransactionTotal(item.price, item.discount, item.quantity, exchangeRate)
    return { value: total, currency }
  }

  const onClearPayment = () => {
    setPaymentId(null)
    setCheckoutId(null)
    setCustomer({ displayName: null, id: null, fullName: null, address: null, point: 0 })
    onChangeCustomer({ displayName: null, id: null, fullName: null, address: null, point: 0 })
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

    if (isQuotation) {
      const item = {
        ...data,
        price: { ...data.price, value: Number(data.price.value) },
        discount: { ...data.discount, value: Number(data.discount?.value) || 0 },
        quantity: Number(data.quantity),
      }
      if (!(item.quantity > 0)) return notify('Please select at least 1 quantity', 'error')
      setTransactions((prev) => prev.map((transaction) => transaction.id === id ? { ...transaction, ...item, total: calculateItemTotal(item) } : transaction))
      reset({})
      return
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
        if (isQuotation) {
          setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
          return
        }
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
    if (disableForm) return
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

  const [isLoading, setIsLoading] = useState(false);

  const handleClickPayment = () => {
    setIsLoading(true)
    onPayment({ transactions, discount, tax, voucher }, (_error, data) => {
      setReceiptDialog({ ...receiptDialog, payment: data })
      setIsLoading(false)
    })
  }

  const handleClickCheckout = () => {
    if (!customer?.id) {
      setCustomerDialog({ ...customerDialog, open: true })
      return notify('Please select customer', 'error')
    }
    setIsLoading(true)
    onCheckout({ transactions, discount, tax, voucher }, (err, data) => {
      setIsLoading(false)
      if (err) return
      setReceiptDialog({ ...receiptDialog, payment: data })
      if (data?.state === 'COMPLETED') {
        setPaymentId(data?._id)
        setCheckoutId(data?._id)
      }
    })
  }

  const handleClickCustomer = () => {
    if (paymentId) return
    setCustomerDialog({ ...customerDialog, open: true })
  }

  const changeQuotationQuantity = (id, change) => {
    setTransactions((prev) => prev.map((transaction) => {
      if (transaction.id !== id) return transaction
      const quantity = transaction.quantity + change
      if (quantity < 1) return transaction
      const item = { ...transaction, quantity }
      return { ...item, total: calculateItemTotal(item) }
    }))
  }

  // Everything the quotation page needs to save or export the current invoice
  const getQuotationData = () => ({
    transactions,
    discount,
    tax,
    voucher,
    customer,
    subtotal,
    total: calculatePaymentTotal(subtotal, discount, tax, voucher, exchangeRate),
    rate: exchangeRate,
  })

  const handleQuotationAction = (action) => {
    setExportAnchor(null)
    if (transactions.length < 1) return notify('No transaction added', 'error')
    action?.(getQuotationData())
  }

  const [exportAnchor, setExportAnchor] = useState<Element | null>(null)

  const handleIncreaseQuantity = (event, transactionId) => {
    event.stopPropagation()
    const id = transactionId
    if (isQuotation) return changeQuotationQuantity(id, 1)

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
    if (isQuotation) return changeQuotationQuantity(id, -1)

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

  const handleClearCustomer = () => {
    setCustomer({ displayName: null, id: null, fullName: null, address: null, point: 0 })
    onChangeCustomer({ displayName: null, id: null, fullName: null, address: null, point: 0 })
  }

  const handleClickPrint = () => {
    setReceiptDialog({ ...receiptDialog, open: true, listTransactions: transactions })
  }

  useEffect(() => {
    dispatch(
      getStore({
        id: 'store',
        fields: [
          'name',
          'logo',
          'contact',
          'address',
          'type',
          'other',
          'font',
          'tax',
        ],
      })
    )
    // eslint-disable-next-line
  }, [])

  const handleChangeTable = (value) => {
    if (paymentId) {
      recalculatePayment(paymentId, { table: value })
        .then(() => notify(`Table updated to ${value} successfully`, 'success'))
        .catch(err => notify(err, 'error'))
    }
    setTable(value)
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
        {status === 'SUCCESS' && <ReceiptDialog dialog={receiptDialog} setDialog={setReceiptDialog} defaultValues={data} />}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {invoiceBar && <CustomerStatistic mode={paymentId ? 'view' : 'edit'} point={customer.point} phone={customer.displayName} name={customer.fullName} address={customer.address} onClick={handleClickCustomer} style={{ marginLeft: 10, cursor: paymentId ? 'default' : 'pointer' }} onClear={handleClearCustomer} />}
          <div style={{ display: 'flex' }}>
            {(invoiceBar && setTable) && <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginRight: '-30px' }}>
              <TableBarRoundedIcon style={{ fontSize: 22 }} />
              <MiniSelectField
                style={{ minWidth: 50, width: 50 }}
                options={tableOptions}
                value={table}
                search={true}
                onChange={(event) =>
                  handleChangeTable(event.target.value)
                }
              />
            </div>}
            <div
              className='toggle'
              style={{ position: 'relative' }}
              onClick={() => toggleInvoiceBar()}
            >
              <ShoppingCartRoundedIcon fontSize='small' />
              {totalQuantity > 0 && <NotificationLabel value={totalQuantity} />}
            </div>
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
                    style={{ cursor: disableForm ? 'default' : 'pointer' }}
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
                          {!disableForm && <IconButton onClick={(event) => handleDecreaseQuantity(event, transaction.id)} style={{ height: 22, width: 22, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.text.secondary }}>-</IconButton>}
                          <span style={{ margin: '0 1px' }}>{transaction.quantity}</span>
                          {!disableForm && <IconButton onClick={(event) => handleIncreaseQuantity(event, transaction.id)} style={{ height: 22, width: 22, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', color: theme.text.secondary }}>+</IconButton>}
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
                        {!disableForm && <IconButton
                          style={{ marginLeft: 5 }}
                          onClick={(event) =>
                            handleRemoveTransaction(event, transaction.id)
                          }
                        >
                          <CloseRoundedIcon
                            style={{ fontSize: 17, color: theme.color.error }}
                          />
                        </IconButton>}
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
              <div className='item preview'>
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
                    !disableForm && setDiscount((prev) => ({
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
                      !disableForm && setDiscount((prev) => ({
                        ...prev,
                        isEditing: !prev.isEditing,
                      }))
                    }
                  >
                    -{currencyFormat(
                      discount.isFixed 
                        ? (subtotal.USD + (subtotal.KHR / (user?.drawer?.sellRate || 4000))) - discount.value 
                        : discount.value, 
                      discount.type
                    )}
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
                    !disableForm && setTax((prev) => ({ ...prev, isEditing: !prev.isEditing }))
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
                      !disableForm && setTax((prev) => ({
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
                    !disableForm && setVoucher((prev) => ({
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
                      !disableForm && setVoucher((prev) => ({
                        ...prev,
                        isEditing: !prev.isEditing,
                      }))
                    }
                  >
                    -{currencyFormat(
                      voucher.isFixed 
                        ? (subtotal.USD + (subtotal.KHR / (user?.drawer?.sellRate || 4000))) - voucher.value
                        : voucher.value, 
                      voucher.type
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className='total'>
              <span>{language['TOTAL']} {invoice && <span title={invoice} style={{ color: theme.color.success, fontWeight: 'bold' }}>#{invoice?.split('-')[1]}</span>}</span>
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
              <FlexBetween style={{ gap: '10px'}}>
                <CustomButton
                  styled={theme}
                  fullWidth
                  onClick={handleClearPayment}
                  style={{
                    color: theme.text.secondary,
                    borderRadius: theme.radius.secondary,
                  }}
                >
                  {language['CLEAR']}
                </CustomButton>
                {isQuotation ? <>
                  {/* A locked (converted) quotation can still be exported, not saved */}
                  {!disableForm && <CustomButton
                    styled={theme}
                    fullWidth
                    onClick={() => handleQuotationAction(onSave)}
                    style={{
                      backgroundColor: `${theme.color.success}22`,
                      color: theme.color.success,
                      borderRadius: theme.radius.secondary,
                    }}
                  >
                    <SaveRoundedIcon style={{ fontSize: 19, marginRight: 5 }} />
                    {language['SAVE']}
                  </CustomButton>}
                  <CustomButton
                    styled={theme}
                    fullWidth
                    aria-controls='quotation-export-menu'
                    onClick={(event) => setExportAnchor(event.currentTarget)}
                    style={{
                      backgroundColor: `${theme.color.info}22`,
                      color: theme.color.info,
                      borderRadius: theme.radius.secondary,
                    }}
                  >
                    <FileDownloadRoundedIcon style={{ fontSize: 19, marginRight: 5 }} />
                    Export
                  </CustomButton>
                  <CustomMenu
                    id='quotation-export-menu'
                    open={Boolean(exportAnchor)}
                    anchorEl={exportAnchor}
                    onClose={() => setExportAnchor(null)}
                    styled={theme}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  >
                    <MenuItem onClick={() => handleQuotationAction(onExportPdf)}>
                      <PictureAsPdfRoundedIcon style={{ fontSize: 19, marginRight: 8, color: theme.color.error }} />
                      PDF
                    </MenuItem>
                    <MenuItem onClick={() => handleQuotationAction(onExportExcel)}>
                      <TableViewRoundedIcon style={{ fontSize: 19, marginRight: 8, color: theme.color.success }} />
                      Excel
                    </MenuItem>
                  </CustomMenu>
                </> : <>
                {paymentId ?
                  <CustomButton
                    onClick={handleClickPrint}
                    styled={theme}
                    fullWidth
                    style={{
                      backgroundColor: `${theme.color.info}22`,
                      color: theme.color.info,
                      borderRadius: theme.radius.secondary,
                    }}
                  >
                    <PrintRoundedIcon
                      style={{ fontSize: 19, marginRight: 5 }}
                    />
                    {language['PRINT']}
                  </CustomButton>
                  : <CustomButton
                    isLoading={isLoading}
                    styled={theme}
                    fullWidth
                    onClick={handleClickCheckout}
                    style={{
                      backgroundColor: `${theme.color.info}22`,
                      color: theme.color.info,
                      borderRadius: theme.radius.secondary,
                    }}
                  >
                  {language['CHECKOUT']}
                </CustomButton>}
                {!checkoutId && <CustomButton
                  isLoading={isLoading}
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
                </CustomButton>}
                </>}
              </FlexBetween>
            </div>
          </div>
        </div>
      </div>
    </CustomInvoiceForm>
  )
})
