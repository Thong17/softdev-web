import useTheme from "hooks/useTheme"
import { useEffect, useState } from "react"
import { TextEllipsis } from "./TextEllipsis"

export const QuantityStatus = ({ qty, min, size, label, padding }: any) => {
  const { theme } = useTheme()
  const [status, setStatus] = useState('success')

  useEffect(() => {
    switch (true) {
      case qty < min:
        setStatus('error')
        break
      case qty < min + (min / 2):
        setStatus('warning')
        break
      default:
        setStatus('success')
        break
    }
  }, [qty, min])

  return (
    <TextEllipsis
      style={{
        padding: padding ? padding : '3px 11px 3px 7px',
        color: theme.color[status],
        backgroundColor: `${theme.color[status]}22`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: theme.radius.secondary,
        fontSize: size || 13,
      }}
    >
      <span style={{ width: 7, height: 7, backgroundColor: theme.color[status], borderRadius: theme.radius.circle, marginRight: 7 }}></span><span>{qty} {label}</span>
    </TextEllipsis>
  )
}
