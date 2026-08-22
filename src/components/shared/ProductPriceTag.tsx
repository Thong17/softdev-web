import useTheme from 'hooks/useTheme'
import { IMenuProduct } from 'api/menu.api'
import { currencyFormat } from 'utils'

interface IProductPriceTag {
  product: IMenuProduct
}

export const ProductPriceTag = ({ product }: IProductPriceTag) => {
  const { theme } = useTheme()
  const onSale = product.salePrice != null && product.salePrice < product.price

  if (!onSale) {
    return (
      <div style={{ fontSize: 15, color: theme.color.info }}>
        {currencyFormat(product.price, product.currency, 0, true)}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontSize: 15, color: theme.color.error }}>
        {currencyFormat(product.salePrice, product.currency, 0, true)}
      </span>
      <span style={{ fontSize: 11, color: theme.text.tertiary, textDecoration: 'line-through' }}>
        {product.price?.toFixed(2)}
      </span>
    </div>
  )
}
