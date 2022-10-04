import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded'
import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'

export const ExchangeRate = () => {
  const { user } = useAuth()
  const { device } = useWeb()
  const { theme } = useTheme()
  const { language } = useLanguage()
  return (
    <div style={{ display: 'flex', alignItems: 'end' }}>
      <span>
      <span style={{ color: theme.color.success, fontSize: theme.responsive[device]?.text.quaternary }}>{language['BUY']}</span> {user?.drawer?.buyRate}
      </span>
      <span style={{ marginRight: 5 }}>,</span>
      <span>
        <span style={{ color: theme.color.error, fontSize: theme.responsive[device]?.text.quaternary }}>{language['SELL']}</span> {user?.drawer?.sellRate}
      </span>
      <SyncAltRoundedIcon style={{ fontSize: 18, margin: '0 10px' }} />
    </div>
  )
}
