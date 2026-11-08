import { Tooltip } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { quotationStatus } from './api'

// Draft / Expired / Converted pill used by the quotation screen and list. A
// converted quotation shows its sale's invoice number on hover.
export const StatusChip = ({ quotation }: { quotation: any }) => {
  const { theme } = useTheme()
  const status = quotationStatus(quotation)
  const color = status === 'Converted' ? theme.color.success : status === 'Expired' ? theme.color.error : theme.text.secondary
  const invoice = quotation?.payment?.invoice

  const chip = (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: theme.radius.primary,
        backgroundColor: `${color}22`,
        color,
        fontSize: 13,
        whiteSpace: 'nowrap',
        cursor: invoice ? 'help' : 'default',
      }}
    >
      {status}
    </span>
  )

  return status === 'Converted' && invoice ? <Tooltip title={`Invoice ${invoice}`}>{chip}</Tooltip> : chip
}
