import { ITableColumn } from 'components/shared/table/StickyTable'

export const columnData: ITableColumn<any>[] = [
  { id: 'invoice', label: 'INVOICE' },
  { id: 'subtotal', label: 'SUBTOTAL' },
  { id: 'discount', label: 'DISCOUNT' },
  { id: 'tax', label: 'TAX' },
  { id: 'voucher', label: 'VOUCHER' },
  { id: 'total', label: 'TOTAL' },
]
export interface Data {
  invoice: string
  subtotal: any
  discount: any
  tax: any
  voucher: any
  total: any
}

export const createData = (
  id: string,
  invoice: string,
  subtotal: any,
  voucher: any,
  discount: any,
  tax: any,
  total: any,
): Data => {  
  return {
    invoice,
    subtotal,
    discount,
    tax,
    voucher,
    total
  }
}
