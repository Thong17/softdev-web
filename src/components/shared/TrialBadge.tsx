import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useWeb from 'hooks/useWeb'
import { calculateDay } from 'utils'

export const TrialBadge = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { device } = useWeb()

  if (!user?.expireAt) return null

  const daysLeft = Math.ceil(calculateDay(new Date(user.expireAt), Date.now()))
  const expired = daysLeft <= 0
  const urgent = expired || daysLeft <= 3
  const color = urgent ? theme.color.error : theme.color.warning
  const dayLabel = daysLeft === 1 ? language['day'] : language['days']

  const label = expired
    ? `${language['TRIAL']} ${language['EXPIRED']}`
    : `${language['TRIAL']} ${language['EXPIRE_IN']} ${daysLeft} ${dayLabel}`

  return (
    <div
      style={{
        backgroundColor: `${color}22`,
        color,
        padding: '4px 10px',
        borderRadius: theme.radius.secondary,
        fontFamily: theme.font.family,
        fontSize: theme.responsive[device].text.tertiary,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}
