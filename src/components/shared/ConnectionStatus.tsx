import { Badge, IconButton, Tooltip } from '@mui/material'
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded'
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded'
import CloudSyncRoundedIcon from '@mui/icons-material/CloudSyncRounded'
import { keyframes } from '@emotion/react'
import { useNavigate } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import useOffline from 'hooks/useOffline'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`

// Navbar cloud: green online, red offline. The badge counts customers added
// offline that aren't on the server yet; a click opens that list.
export const ConnectionStatus = () => {
  const { theme } = useTheme()
  const { online, pending, syncing } = useOffline()
  const navigate = useNavigate()
  const count = pending.length
  const color = online ? theme.color.success : theme.color.error
  const Icon = syncing ? CloudSyncRoundedIcon : online ? CloudDoneRoundedIcon : CloudOffRoundedIcon
  const title = `${syncing ? 'Syncing…' : online ? 'Online' : 'Offline'}${count ? ` · ${count} customer${count > 1 ? 's' : ''} waiting to sync` : ''}`

  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={title}
        onClick={() => navigate('/function/customer')}
        style={{ borderRadius: theme.radius.primary, color }}
      >
        <Badge badgeContent={count} color='warning' max={99}>
          <Icon sx={{ animation: syncing ? `${pulse} 1s ease-in-out infinite` : 'none' }} />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
