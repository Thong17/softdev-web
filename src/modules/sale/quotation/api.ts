import Axios from 'constants/functions/Axios'
import { convertBufferToArrayBuffer, downloadBuffer } from 'utils/index'

// Maps the invoice panel's data (see InvoiceForm `getQuotationData`) to the API body
export const mapQuotationBody = ({ transactions, discount, tax, voucher, customer, rate }, expireAt?: string) => ({
  customer: customer?.id || null,
  items: transactions.map((transaction) => ({
    product: transaction.product || null,
    description: transaction.description || '',
    price: Number(transaction.price?.value) || 0,
    currency: transaction.price?.currency || 'USD',
    quantity: Number(transaction.quantity) || 1,
    discount: {
      value: Number(transaction.discount?.value) || 0,
      type: transaction.discount?.currency || 'PCT',
      isFixed: !!transaction.discount?.isFixed,
    },
    total: {
      value: Number(transaction.total?.value) || 0,
      currency: transaction.total?.currency || 'USD',
    },
    profile: transaction.profile || null,
    note: transaction.note || null,
    // Which stock to take when the quotation is converted to cashing
    color: transaction.color || null,
    options: (transaction.options || []).map((option) => option?._id || option),
    customerOption: transaction.customerOption || null,
  })),
  discounts: [{ value: Number(discount.value) || 0, type: discount.type, isFixed: !!discount.isFixed }],
  services: [{ value: Number(tax.value) || 0, type: tax.type }],
  vouchers: [{ value: Number(voucher.value) || 0, type: voucher.type, isFixed: !!voucher.isFixed }],
  rate: {
    ...(rate?.buyRate && { buyRate: rate.buyRate }),
    ...(rate?.sellRate && { sellRate: rate.sellRate }),
  },
  ...(expireAt && { expireAt }),
})

export const saveQuotation = async (id, data, expireAt?: string) => {
  const response = await Axios({
    method: id ? 'PUT' : 'POST',
    url: id ? `/sale/quotation/update/${id}` : '/sale/quotation/create',
    body: mapQuotationBody(data, expireAt),
  })
  return response?.data?.data
}

export const getQuotation = async (id) => {
  const response = await Axios({ method: 'GET', url: `/sale/quotation/detail/${id}` })
  return response?.data?.data
}

// Creates the cart items for cashing; returns { quotation, transactions }
export const convertQuotation = async (id) => {
  const response = await Axios({ method: 'POST', url: `/sale/quotation/convert/${id}` })
  return response?.data?.data
}

export const exportQuotationExcel = async (id, lang) => {
  const response = await Axios({
    method: 'POST',
    url: `/sale/quotation/excel/export/${id}`,
    body: { lang },
  })
  downloadBuffer(convertBufferToArrayBuffer(response?.data?.file?.data), response?.data?.name)
}

// Shared helpers for showing a quotation's state
export const isQuotationExpired = (quotation) =>
  quotation?.status !== 'CONVERTED' && !!quotation?.expireAt && new Date(quotation.expireAt) < new Date()

export const quotationStatus = (quotation) => {
  if (quotation?.status === 'CONVERTED') return 'Converted'
  if (isQuotationExpired(quotation)) return 'Expired'
  return 'Draft'
}
