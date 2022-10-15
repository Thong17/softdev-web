import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import { currencyFormat } from 'utils'
import { TextEllipsis } from './TextEllipsis'

export const PromotionTag = ({ data }: any) => {
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
    <div
      style={{
        backgroundColor: `${theme.color.success}cc`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        padding: '4px 8px 4px 1px',
        position: 'absolute',
        borderRadius: `0 ${theme.radius.secondary} ${theme.radius.secondary} 0`,
        top: 7,
        left: 0,
      }}
    >
      <TextEllipsis>{currencyFormat(data.value, data.type)} {data.isFixed ? language['ONLY'] : language['DISCOUNT']}</TextEllipsis>
    </div>
  )
}
