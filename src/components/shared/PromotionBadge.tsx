import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { IMenuProduct } from 'api/menu.api'

interface IPromotionBadge {
  product: IMenuProduct
}

export const PromotionBadge = ({ product }: IPromotionBadge) => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const onSale = product.salePrice != null && product.salePrice < product.price
  if (!onSale) return null

  const percentOff = Math.round((1 - product.salePrice! / product.price) * 100)
  if (percentOff <= 0) return null

  const label = product.promotionLabel?.[lang] || product.promotionLabel?.['English']

  return (
    <div
      title={label}
      style={{
        position: 'absolute',
        top: 5,
        right: -14,
        background: theme.color.error,
        color: '#fff',
        padding: '2px 8px',
        fontSize: 11,
        width: 40,
        textAlign: 'center',
        transform: 'rotate(45deg)',
        boxShadow: theme.shadow.secondary
      }}
    >
      -{percentOff}%
    </div>
  )
}
