import useTheme from 'hooks/useTheme'
import { IMenuProduct } from 'api/menu.api'

interface IProductPriceTag {
  product: IMenuProduct
}

export const ProductPriceTag = ({ product }: IProductPriceTag) => {
  const { theme } = useTheme()
  const onSale = product.salePrice != null && product.salePrice < product.price

  if (!onSale) {
    return (
      <div style={{ fontSize: 13, color: theme.color.info }}>
        {product.price?.toFixed(2)} {product.currency}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontSize: 13, color: theme.color.error }}>
        {product.salePrice?.toFixed(2)} {product.currency}
      </span>
      <span style={{ fontSize: 11, color: theme.text.tertiary, textDecoration: 'line-through' }}>
        {product.price?.toFixed(2)}
      </span>
    </div>
  )
}
