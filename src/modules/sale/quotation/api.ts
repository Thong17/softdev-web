import Axios from 'constants/functions/Axios'
import { convertBufferToArrayBuffer, downloadBuffer } from 'utils/index'

// Maps the invoice panel's data (see InvoiceForm `getQuotationData`) to the API body
export const mapQuotationBody = ({ transactions, discount, tax, voucher, customer, rate }) => ({
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
  })),
  discounts: [{ value: Number(discount.value) || 0, type: discount.type, isFixed: !!discount.isFixed }],
  services: [{ value: Number(tax.value) || 0, type: tax.type }],
  vouchers: [{ value: Number(voucher.value) || 0, type: voucher.type, isFixed: !!voucher.isFixed }],
  rate: {
    ...(rate?.buyRate && { buyRate: rate.buyRate }),
    ...(rate?.sellRate && { sellRate: rate.sellRate }),
  },
})

export const saveQuotation = async (id, data) => {
  const response = await Axios({
    method: id ? 'PUT' : 'POST',
    url: id ? `/sale/quotation/update/${id}` : '/sale/quotation/create',
    body: mapQuotationBody(data),
  })
  return response?.data?.data
}

export const getQuotation = async (id) => {
  const response = await Axios({ method: 'GET', url: `/sale/quotation/detail/${id}` })
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
