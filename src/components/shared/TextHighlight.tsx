import useLanguage from "hooks/useLanguage"
import { TextEllipsis } from "./TextEllipsis"

export const TextHighlight = ({ text, color, size }: any) => {
  const { language } = useLanguage()
  return (
    <TextEllipsis
      style={{
        padding: '0 11px',
        height: 27,
        color: color,
        backgroundColor: `${color}22`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: 5,
        fontSize: size || 13
      }}
    >
      {language[text] ?? text}
    </TextEllipsis>
  )
}
