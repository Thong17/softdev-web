import useTheme from "hooks/useTheme"
import { useEffect, useState } from "react"
import { compareDate } from "utils"
import { TextEllipsis } from "./TextEllipsis"

export const LoanStatus = ({ dueDate }: any) => {
  const { theme } = useTheme()
  const [status, setStatus] = useState('success')
  const [text, setText] = useState('active')

  useEffect(() => {
    switch (true) {
      case !compareDate(Date.now(), new Date(dueDate)):
        setText('Pending')
        setStatus('warning')
        break
  
      case compareDate(Date.now(), new Date(dueDate)):
        setText('Overdue')
        setStatus('error')
        break
    
      default:
        setText('Done')
        setStatus('success')
        break
    }
  }, [dueDate])

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
        fontSize: 13
      }}
    >
      <span style={{ width: 7, height: 7, backgroundColor: theme.color[status], borderRadius: theme.radius.circle, marginRight: 7 }}></span><span>{text}</span>
    </TextEllipsis>
  )
}
