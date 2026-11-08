import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import { ExcelIcon } from 'components/shared/icons/ExcelIcon'
import moment from 'moment'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import Axios from 'constants/functions/Axios'
import { convertBufferToArrayBuffer, downloadBuffer } from 'utils'

// The date range a report shows: an explicit from/to when set, otherwise the
// period picked in its filter (day/week/month/year), like the report itself
export const reportRange = (fromDate?: string, toDate?: string, period: string = 'day') => {
  if (fromDate && toDate) return { fromDate, toDate }
  const unit = (['day', 'week', 'month', 'year'].includes(period) ? period : 'day') as moment.unitOfTime.StartOf
  return {
    fromDate: moment().startOf(unit).format('YYYY-MM-DD'),
    toDate: moment().endOf(unit).format('YYYY-MM-DD'),
  }
}

// Downloads `/report/export/<type>` as .xlsx for the given range
export const ExportButton = ({ type, range, label = 'Export' }: { type: 'sale' | 'product' | 'staff' | 'inventory', range?: () => { fromDate: string, toDate: string }, label?: string }) => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const { lang } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    setLoading(true)
    const params = new URLSearchParams({ lang, ...(range ? range() : {}) })
    Axios({ method: 'GET', url: `/report/export/${type}`, params })
      .then((response) => downloadBuffer(convertBufferToArrayBuffer(response?.data?.file?.data), response?.data?.name))
      .catch((err) => notify(err?.response?.data?.msg || 'Failed to export', 'error'))
      .finally(() => setLoading(false))
  }

  return (
    // The spinner takes the icon's place, so the button keeps its width while loading
    <CustomButton
      styled={theme}
      disabled={loading}
      onClick={handleExport}
      style={{ marginLeft: 10, backgroundColor: `${theme.color.success}22`, color: theme.color.success, whiteSpace: 'nowrap' }}
    >
      <span style={{ display: 'inline-flex', width: 18, height: 18, marginRight: 6, alignItems: 'center', justifyContent: 'center' }}>
        {loading
          ? <CircularProgress size={14} style={{ color: theme.color.success }} />
          : <ExcelIcon size={18} />}
      </span>
      {label}
    </CustomButton>
  )
}
