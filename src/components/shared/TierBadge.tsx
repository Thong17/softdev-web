import bronze from 'assets/tiers/bronze.png'
import silver from 'assets/tiers/silver.png'
import gold from 'assets/tiers/gold.png'
import useTheme from 'hooks/useTheme'

export const tierIcons = { bronze, silver, gold }

export const tierIconOptions = [
  { label: 'None', value: '' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Silver', value: 'silver' },
  { label: 'Gold', value: 'gold' },
  { label: 'Custom', value: 'custom' },
]

// The tier's uploaded image, else its medal (bronze / silver / gold), else nothing
export const TierIcon = ({ icon, image, size = 18 }: { icon?: string, image?: string, size?: number }) => {
  const src = image ? `${process.env.REACT_APP_API_UPLOADS}${image}` : icon ? tierIcons[icon] : null
  if (!src) return null
  return <img src={src} alt={icon || 'tier'} width={size} height={size} style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }} />
}

// Medal + tier name in the tier's colour
export const TierBadge = ({ tier, size = 18, children }: { tier?: any, size?: number, children?: any }) => {
  const { theme } = useTheme()
  if (!tier) return <span style={{ color: theme.text.tertiary }}>--</span>
  const color = tier.color || theme.text.secondary
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: tier.icon || tier.iconImage?.filename ? '2px 10px 2px 4px' : '3px 10px',
        borderRadius: theme.radius.primary,
        backgroundColor: `${color}22`,
        color,
        fontSize: 13,
        whiteSpace: 'nowrap',
      }}
    >
      <TierIcon icon={tier.icon} image={tier.iconImage?.filename} size={size} />
      {tier.name}
      {children}
    </span>
  )
}
