import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { Tooltip } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { TextEllipsis } from '../TextEllipsis'

// `onClick` (optional) makes the value open more detail, e.g. how a report
// total is worked out; `hint` is shown on hover
export const DetailSection = ({ title, data, icon, action, header, onClick, hint }: any) => {
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
      {(() => {
        const value = (
          <div
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (event) => (event.key === 'Enter' || event.key === ' ') && onClick() : undefined}
            style={{ display: 'flex', alignItems: 'center', backgroundColor: theme.background.primary, borderRadius: theme.radius.secondary, height: 55, padding: '5px 10px', boxSizing: 'border-box', cursor: onClick ? 'pointer' : undefined }}
          >
            {icon && <div style={{ marginRight: 10, display: 'grid', placeItems: 'center' }}>{icon}</div>}
            <TextEllipsis style={{ fontSize: theme.responsive[device]?.text.h1, color: theme.text.primary }}>{data}</TextEllipsis>
            {onClick && <InfoOutlinedIcon style={{ marginLeft: 'auto', paddingLeft: 8, fontSize: 18, color: theme.text.quaternary }} />}
          </div>
        )
        return onClick && hint ? <Tooltip title={hint}>{value}</Tooltip> : value
      })()}
      {action && <div style={{ position: 'absolute', right: 10, bottom: 10 }}>{action}</div>}
    </div>
  )
}
