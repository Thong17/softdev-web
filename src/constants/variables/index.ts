import { IOptions } from 'components/shared/form/SelectField'
import { ITableColumn } from 'components/shared/table/StickyTable'

export const currencyOptions: IOptions[] = [
  {
    value: 'USD',
    label: 'USD',
  },
  {
    value: 'KHR',
    label: 'KHR',
  },
]

export const invoiceColumns: ITableColumn<string>[] = [
  { id: 'description', label: 'Description' },
  { id: 'qty', label: 'Qty' },
  { id: 'price', label: 'Price' },
  { id: 'disc', label: 'Disc' },
  { id: 'total', label: 'Total' },
]
