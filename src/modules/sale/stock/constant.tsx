import { DeviceOptions } from 'contexts/web/interface'
import { MenuDialog } from 'components/shared/MenuDialog'
import {
  StockButton,
  ViewButton,
  DeleteButton,
  UpdateButton,
  // ReportButton,
} from 'components/shared/table/ActionButton'
import { MenuItem } from '@mui/material'
import { ITableColumn } from 'components/shared/table/StickyTable'
import { ReactElement } from 'react'
import { calculateDay, currencyFormat, dateFormat } from 'utils'
import { ColorPlate } from 'components/shared/table/ColorPlate'
import { IThemeStyle } from 'contexts/theme/interface'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { inputDateFormat } from 'utils'

export interface IStockBody {
  cost: number
  currency: string
  quantity: number
  code?: string
  expireAt?: Date
  alertAt: number
  color?: string
  option?: string
  product: string
}

export const initStock = { alertAt: 0 }

export interface Data {
  id: string
  tags: string
  name: string
  stock: number
  alertAt: number
  price: number
  priceTag: ReactElement
  currency: string
  code: string | null
  description: string
  isStock: boolean
  expireAt: number
  profile: string
  brand: string
  category: string
  createdBy: string
  createdAt: string
  status: boolean
  action: ReactElement
}

export declare type StockColumnHeader =
  | 'no'
  | 'cost'
  | 'currency'
  | 'quantity'
  | 'remain'
  | 'total'
  | 'code'
  | 'expireAt'
  | 'alertAt'
  | 'color'
  | 'option'
  | 'createdBy'
  | 'action'

export const stockColumnData: ITableColumn<StockColumnHeader>[] = [
  { id: 'cost', label: 'COST' },
  { id: 'currency', label: 'CURRENCY' },
  { id: 'quantity', label: 'REMAIN' },
  { id: 'total', label: 'TOTAL' },
  { id: 'action', label: 'ACTION', align: 'center' },
]

export const mapStockBody = (body) => {
  return {
    cost: body?.cost,
    currency: body?.currency,
    quantity: body?.quantity,
    code: body.code,
    expireAt: inputDateFormat(body?.expireAt),
    alertAt: body?.alertAt,
    color: body?.color,
    product: body?.product,
    options: body?.options,
    customers: body?.customers,
  }
}

export const createData = (
  id: string,
  profile: string,
  tags: string,
  name: string,
  stocks: Object[],
  price: number,
  currency: string,
  code: string | null,
  isStock: boolean,
  brand: string,
  category: string,
  description: string,
  createdBy: string,
  createdAt: string,
  status: boolean,
  privilege: any,
  rate: any,
  device: DeviceOptions,
  navigate: Function,
  handleEnableStock
): Data => {
  let action = (
    <>
      {device === 'mobile' ? (
        privilege?.product?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem
              component='div'
              onClick={() => navigate(`/sale/stock/item/${id}`)}
            >
              Stock
            </MenuItem>
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.product?.update && (
            <StockButton
              style={{ margin: 0 }}
              onClick={() => isStock ? navigate(`/sale/stock/item/${id}`) : handleEnableStock(id)}
              isStock={isStock}
            />
          )}
        </>
      )}
    </>
  )

  let alertStocks: any[] = []

  let stock = 0
  let alertAt = 0
  let expireAt: any = null
  stocks?.forEach((stk: any) => {
    if (stk.expireAt) {
      const stockExpire = calculateDay(new Date(stk.expireAt), Date.now())
      if (expireAt && stockExpire < expireAt) expireAt = stockExpire
      else expireAt = stockExpire
    }
    
    stock += stk.quantity
    alertAt += stk.alertAt
    if (stk.quantity < stk.alertAt) {
      alertStocks.push(stk)
    }
  })
  const buyRate = rate || 4000

  return {
    id,
    profile,
    name,
    stock: stock,
    alertAt,
    priceTag: currencyFormat(price, currency),
    price: currency === 'USD' ? price : price / buyRate,
    currency,
    code,
    isStock,
    expireAt,
    brand,
    category,
    description,
    createdBy,
    createdAt,
    status,
    action,
    tags
  }
}

export const createStockData = (
  id: string,
  cost: number,
  currency: string,
  quantity: number,
  remain: number,
  code: string | null,
  expireAt: Date,
  alertAt: number,
  color: string,
  options: Array<string>,
  createdBy: string,
  privilege: any,
  device: DeviceOptions,
  theme: IThemeStyle,
  onEditStock: Function,
  onDeleteStock: Function,
  onViewStock: Function
) => {
  let action = (
    <div style={{ float: 'right' }}>
      {device === 'mobile' ? (
        privilege?.brand?.detail && (
          <MenuDialog label={<ViewButton />}>
            <MenuItem component='div'>Edit</MenuItem>
            <MenuItem component='div'>Delete</MenuItem>
            {/* <MenuItem component='div'>View</MenuItem> */}
          </MenuDialog>
        )
      ) : (
        <>
          {privilege?.brand?.update && <UpdateButton onClick={() => onEditStock(id)} />}
          {privilege?.brand?.delete && <DeleteButton onClick={() => onDeleteStock(id)} />}
          {/* {privilege?.brand?.detail && <ReportButton onClick={() => onViewStock(id)} />} */}
        </>
      )}
    </div>
  )

  let option = options.length ? (<MenuDialog
      label={<ArrowDropDownRoundedIcon />}
      style={{
        fontSize: theme.responsive[device].text.quaternary,
        color: theme.text.secondary,
      }}
    >
      {options.map((opt, index) => {
        return (
          <MenuItem key={index} component='div'>
            {opt}
          </MenuItem>
        )
      })}
    </MenuDialog>) : null
  
  return {
    id,
    cost: currencyFormat(cost, currency),
    currency,
    quantity,
    remain,
    total: currencyFormat(cost * quantity, currency),
    code,
    expireAt: dateFormat(expireAt),
    alertAt,
    color: <ColorPlate color={color} />,
    option,
    createdBy,
    action,
  }
}
