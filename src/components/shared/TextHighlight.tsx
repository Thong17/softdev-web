import { TextEllipsis } from "./TextEllipsis"

export const TextHighlight = ({ text, color, size }: any) => {
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
      {text}
    </TextEllipsis>
  )
}
