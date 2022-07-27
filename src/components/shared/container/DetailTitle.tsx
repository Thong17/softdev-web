import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { TextEllipsis } from '../TextEllipsis'

export const DetailTitle = ({ title, value }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div style={{ padding: 10, borderRadius: theme.radius.secondary }}>
      <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.h1, color: theme.text.secondary }}>
        {value}
      </TextEllipsis>
      <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.quaternary, color: theme.text.quaternary }}>
        {title}
      </TextEllipsis>
    </div>
  )
}
