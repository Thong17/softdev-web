import { useEffect, useState } from 'react'
import { SelectField } from 'components/shared/form'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import { timeFormat } from 'utils'
import { TierBadge, TierIcon } from 'components/shared/TierBadge'

const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

const reasons = {
  UPGRADE: 'Moved up after a payment',
  RECHECK: 'Monthly re-check',
  SETTINGS: 'Tiers were changed',
  INITIAL: 'First placement',
  MANUAL: 'Locked by staff',
  UNLOCK: 'Unlocked, placed by spending',
}

// The customer's tier on their profile: what they spent, how far the next tier
// is, a lock to keep a chosen tier, and the history of changes
export const TierPanel = ({ customerId, locked, tierId, onChangeLocked, onChangeTier }: {
  customerId?: string
  locked: boolean
  tierId?: string
  onChangeLocked: (locked: boolean) => void
  onChangeTier: (tierId: string) => void
}) => {
  const { theme } = useTheme()
  const [status, setStatus] = useState<any>(null)
  const [tiers, setTiers] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (customerId) {
      Axios({ method: 'GET', url: `/organize/customer/tier/status/${customerId}` })
        .then((response) => {
          setStatus(response?.data?.data)
          setTiers(response?.data?.data?.tiers || [])
        })
        .catch(() => {})
    } else {
      Axios({ method: 'GET', url: '/organize/customer/tier' })
        .then((response) => setTiers(response?.data?.data?.tiers || []))
        .catch(() => {})
    }
  }, [customerId])

  const lowest = tiers[0]
  const current = status?.tier || (customerId ? null : lowest)
  const muted = { color: theme.text.tertiary, fontSize: 13 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 15 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ color: theme.text.secondary, fontSize: 14 }}>Tier</span>
        <TierBadge tier={current} size={20} />
        {current && <span style={muted}>{current.discount || 0}% off</span>}
        {status && (
          <span style={muted}>
            · Spent {money(status.spent)} in the last {status.months} months
            {!status.tierLocked && (status.nextTier
              ? ` · ${money(status.toNext)} more to reach ${status.nextTier.name}`
              : ' · top tier')}
          </span>
        )}
        {!customerId && <span style={muted}>New customers start in {lowest?.name || 'the lowest tier'} and move up as they buy.</span>}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.text.secondary, fontSize: 14, cursor: 'pointer', width: 'fit-content' }}>
        <input
          type='checkbox'
          checked={locked}
          onChange={(event) => {
            onChangeLocked(event.target.checked)
            // Start from the current tier when locking
            if (event.target.checked && !tierId && current?._id) onChangeTier(current._id)
          }}
        />
        Lock tier (don't change it automatically)
      </label>
      {locked && (
        <div style={{ maxWidth: 320 }}>
          <SelectField
            label='Locked tier'
            value={tierId || ''}
            options={tiers.map((tier) => ({ label: `${tier.name} · ${tier.discount || 0}% off`, value: tier._id }))}
            onChange={(event) => onChangeTier(event.target.value as string)}
          />
        </div>
      )}

      {!!status?.history?.length && (
        <div>
          <span role='button' onClick={() => setShowHistory(!showHistory)} style={{ color: theme.color.info, fontSize: 13, cursor: 'pointer' }}>
            {showHistory ? 'Hide' : 'Show'} tier history ({status.history.length})
          </span>
          {showHistory && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {status.history.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: theme.text.secondary, flexWrap: 'wrap' }}>
                  <span style={{ ...muted, minWidth: 120 }}>{timeFormat(item.createdAt, 'YYYY-MM-DD HH:mm')}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {item.fromName || '--'} →
                    <TierIcon icon={tiers.find((tier) => tier._id === item.toTier)?.icon} image={tiers.find((tier) => tier._id === item.toTier)?.iconImage?.filename} size={16} />
                    <b>{item.toName}</b>
                  </span>
                  <span style={muted}>
                    {reasons[item.reason] || item.reason}
                    {item.spent !== undefined && item.spent !== null ? ` · spent ${money(item.spent)}` : ''}
                    {item.createdBy?.username ? ` · ${item.createdBy.username}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
