import useTheme from "hooks/useTheme"
import { useEffect, useState } from "react"
import { compareDate } from "utils"
import { TextEllipsis } from "./TextEllipsis"

export const PromotionStatus = ({ start, expire, size }: any) => {
  const { theme } = useTheme()
  const [status, setStatus] = useState('success')
  const [text, setText] = useState('active')

  useEffect(() => {
    switch (true) {
      case !compareDate(Date.now(), new Date(start)):
        setText('Inactive')
        setStatus('info')
        break
  
      case compareDate(Date.now(), new Date(expire)):
        setText('Expired')
        setStatus('error')
        break
    
      default:
        setText('Active')
        setStatus('success')
        break
    }
  }, [start, expire])

  return (
    <TextEllipsis
      style={{
        padding: '3px 11px 3px 7px',
        color: theme.color[status],
        backgroundColor: `${theme.color[status]}22`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: theme.radius.secondary,
        fontSize: size || 13
      }}
    >
      <span style={{ width: 7, height: 7, backgroundColor: theme.color[status], borderRadius: theme.radius.circle, marginRight: 7 }}></span><span>{text}</span>
    </TextEllipsis>
  )
}
