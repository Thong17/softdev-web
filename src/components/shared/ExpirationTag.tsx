import useTheme from 'hooks/useTheme'
import { TextEllipsis } from './TextEllipsis'

export const ExpirationTag = ({ value }: any) => {
  const { theme } = useTheme()

  return (
    <div
      style={{
        backgroundColor: `${theme.color.error}cc`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        padding: '4px 8px 4px 1px',
        position: 'absolute',
        borderRadius: `0 ${theme.radius.secondary} ${theme.radius.secondary} 0`,
        bottom: 7,
        left: 0,
      }}
    >
      <TextEllipsis>Expire In {value} {value > 1 ? 'Days' : 'Day'}</TextEllipsis>
    </div>
  )
}
