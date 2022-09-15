import useTheme from "hooks/useTheme"
import { currencyFormat } from "utils"
import { TextEllipsis } from "./TextEllipsis"

export const PromotionLabel = ({ value, type, isFixed, size }: any) => {
  const { theme } = useTheme()

  return (
    <TextEllipsis
      style={{
        padding: '3px 11px 3px 7px',
        color: theme.color.info,
        backgroundColor: `${theme.color.info}22`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: theme.radius.secondary,
        fontSize: size || 13
      }}
    >
      <span style={{ marginRight: 5 }}>{isFixed ? 'Only' : 'Discount'}</span>
      <span>{currencyFormat(value, type)}</span>
    </TextEllipsis>
  )
}
