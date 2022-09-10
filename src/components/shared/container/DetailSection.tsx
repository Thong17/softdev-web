import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { TextEllipsis } from '../TextEllipsis'

export const DetailSection = ({ title, data, icon, action, header }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div
      style={{
        backgroundColor: `${theme.background.secondary}cc`,
        width: 'fit-content',
        minWidth: 200,
        height: 100,
        borderRadius: theme.radius.secondary,
        padding: '10px 5px 5px 5px',
        boxSizing: 'border-box',
        boxShadow: theme.shadow.container,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5px' }}>
        <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.primary, color: theme.text.secondary }}>
          {title}
        </TextEllipsis>
        {header}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.background.primary, borderRadius: theme.radius.secondary, height: 55, padding: '5px 10px', boxSizing: 'border-box' }}>
        {icon && <div style={{ marginRight: 10, display: 'grid', placeItems: 'center' }}>{icon}</div>}
        <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.h1, color: theme.text.primary }}>{data}</TextEllipsis>
      </div>
      {action && <div style={{ position: 'absolute', right: 10, bottom: 10 }}>{action}</div>}
    </div>
  )
}
