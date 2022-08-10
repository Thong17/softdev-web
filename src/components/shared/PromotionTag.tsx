import useTheme from 'hooks/useTheme'
import { currencyFormat } from 'utils'
import { TextEllipsis } from './TextEllipsis'
import DiscountRoundedIcon from '@mui/icons-material/DiscountRounded'

export const PromotionTag = ({ data }: any) => {
  const { theme } = useTheme()

  return (
    <div
      style={{
        backgroundColor: `${theme.color.info}dd`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        padding: '4px 5px',
        position: 'absolute',
        borderRadius: `0 ${theme.radius.primary} ${theme.radius.primary} 0`,
        top: 7,
        left: 0,
      }}
    >
      <TextEllipsis>{data.isFixed ? 'Only' : 'Discount'}{currencyFormat(data.value, data.type)}</TextEllipsis><DiscountRoundedIcon style={{ marginLeft: 3, fontSize: 15 }} />
    </div>
  )
}
