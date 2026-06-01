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

export const currencySymbolOptions: IOptions[] = [
  {
    value: 'USD',
    label: <>&#36;</>,
  },
  {
    value: 'KHR',
    label: <>&#6107;</>,
  },
]

export const invoiceColumns: ITableColumn<string>[] = [
  { id: 'description', label: 'Item' },
  { id: 'qty', label: 'Qty' },
  { id: 'disc', label: 'Disc' },
  { id: 'price', label: 'Price' },
]

export const tableOptions = [
  { label: '--', value: '--' },
  ...Array.from({ length: 99 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');

    return {
      label: num,
      value: num,
    };
  }),
];
