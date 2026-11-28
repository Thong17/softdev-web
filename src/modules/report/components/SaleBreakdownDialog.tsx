import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { CircularProgress, styled } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { MiniSelectField } from 'components/shared/form'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { IThemeStyle } from 'contexts/theme/interface'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import { currencyFormat, timeFormat } from 'utils'
import { getReportSaleBreakdown, getReportSaleBreakdownRows } from '../redux'

export type BreakdownType = 'income' | 'profit'
type SourceKey = 'sales' | 'loan' | 'clearance' | 'payLater'
// What the list shows: every source, or one
type ListKey = SourceKey | 'all'

interface IRow {
  id: string
  invoice?: string
  date: string
  income: number
  cost: number
  profit: number
  fullCost?: number
  installmentCount?: number
  source: SourceKey
}

interface ISource {
  key: SourceKey
  count: number
  income: number
  cost: number
  profit: number
}

interface ISummary {
  from: string
  to: string
  income: number
  cost: number
  profit: number
  sources: ISource[]
}

const sourceText: Record<SourceKey, [string, string]> = {
  sales: ['SOURCE_SALES', 'SOURCE_SALES_DESC'],
  loan: ['SOURCE_LOAN', 'SOURCE_LOAN_DESC'],
  clearance: ['SOURCE_CLEARANCE', 'SOURCE_CLEARANCE_DESC'],
  payLater: ['SOURCE_PAY_LATER', 'SOURCE_PAY_LATER_DESC'],
}

const presets = [
  { unit: 'day', label: 'TODAY' },
  { unit: 'week', label: 'THIS_WEEK' },
  { unit: 'month', label: 'THIS_MONTH' },
  { unit: 'year', label: 'THIS_YEAR' },
] as const

// The value a datetime-local input takes
const INPUT_FORMAT = 'YYYY-MM-DDTHH:mm'

const money = (value: number) => currencyFormat(value || 0, 'USD')

const DateTimeInput = styled('input')(
  ({ styled }: { styled: IThemeStyle }) => ({
    background: 'none',
    border: styled.border.quaternary,
    padding: '5px 6px',
    borderRadius: styled.radius.primary,
    color: styled.text.secondary,
    fontFamily: 'inherit',
    minWidth: 0,
    flex: 1,
    '&::-webkit-calendar-picker-indicator': { filter: 'invert(0.5)' },
    '&:hover, &:focus': { border: styled.border.quaternary, outline: 'none' },
  })
)

// How the Income or Profit card on the sale report is worked out. Left: the
// date-time range, the formula with its numbers, and the total from each
// source. Right: the sales or payments behind the chosen source, a page at a
// time. It opens on the card's period; the numbers come from the same
// calculation as the card.
export const SaleBreakdownDialog = ({ type, query, onClose }: { type: BreakdownType | null, query: URLSearchParams, onClose: () => void }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const isProfit = type === 'profit'
  const narrow = device === 'mobile' || device === 'tablet'

  // Inputs as typed, and the range last sent (null: the card's period)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [applied, setApplied] = useState<{ fromDate: string, toDate: string } | null>(null)
  const [rangeError, setRangeError] = useState('')
  const [summary, setSummary] = useState<ISummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  // Why the totals didn't load; the old numbers aren't shown as current
  const [summaryError, setSummaryError] = useState('')
  const [retry, setRetry] = useState(0)
  const [selected, setSelected] = useState<ListKey>('all')
  const [rows, setRows] = useState<IRow[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [rowsLoading, setRowsLoading] = useState(false)
  const applyTimer = useRef<ReturnType<typeof setTimeout>>()
  // Answers to older requests are dropped
  const summaryRequest = useRef(0)
  const rowsRequest = useRef(0)
  // Invoice search (as typed, and as sent) and date order of the list
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()
  // Total of every row that matched, across all pages
  const [rowsTotal, setRowsTotal] = useState<{ income: number, cost: number, profit: number } | null>(null)

  const params = (): Record<string, string> => applied
    ? { type: type || 'income', ...applied }
    : { type: type || 'income', _totalIncome: query.get('_totalIncome') || 'day', _totalProfit: query.get('_totalProfit') || 'day' }

  // A fresh start each time a card is clicked
  useEffect(() => {
    if (!type) return
    setApplied(null)
    setSummary(null)
    setRangeError('')
    setPage(0)
    setSelected('all')
    setSearchText('')
    setSearch('')
    setSort('desc')
    setRows([])
    setCount(0)
    setFrom('')
    setTo('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    if (!type) return
    const request = ++summaryRequest.current
    setSummaryLoading(true)
    setSummaryError('')
    getReportSaleBreakdown(params())
      .then((response) => {
        if (request !== summaryRequest.current) return
        const data: ISummary = response?.data
        setSummary(data)
        // The card's period fills the inputs
        if (!applied && data) {
          setFrom(moment(data.from).format(INPUT_FORMAT))
          setTo(moment(data.to).format(INPUT_FORMAT))
        }
      })
      .catch((err) => {
        if (request !== summaryRequest.current) return
        setSummary(null)
        setSummaryError(err?.response?.data?.msg || err?.message || 'Could not load the totals')
      })
      .finally(() => request === summaryRequest.current && setSummaryLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, applied, retry])

  useEffect(() => {
    if (!type) return
    const request = ++rowsRequest.current
    setRowsLoading(true)
    getReportSaleBreakdownRows({ ...params(), source: selected, page: String(page), limit: String(limit), sort, ...(search && { search }) })
      .then((response) => {
        if (request !== rowsRequest.current) return
        setRows(response?.data || [])
        setCount(response?.length || 0)
        setRowsTotal(response?.total || null)
      })
      .catch((err) => request === rowsRequest.current && notify(err?.response?.data?.msg, 'error'))
      .finally(() => request === rowsRequest.current && setRowsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, applied, selected, page, limit, sort, search])

  useEffect(() => () => {
    clearTimeout(applyTimer.current)
    clearTimeout(searchTimer.current)
  }, [])

  const changeSearch = (value: string) => {
    setSearchText(value)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setPage(0)
      setSearch(value.trim())
    }, 350)
  }

  // Sends the range once the inputs stop changing; `now` for a preset
  const changeRange = (nextFrom: string, nextTo: string, now = false) => {
    setFrom(nextFrom)
    setTo(nextTo)
    clearTimeout(applyTimer.current)
    const start = moment(nextFrom, INPUT_FORMAT, true)
    const end = moment(nextTo, INPUT_FORMAT, true)
    // A year still being typed (e.g. 0002) isn't a range yet
    const complete = (date: moment.Moment) => date.isValid() && date.year() >= 1900 && date.year() <= 2200
    if (!complete(start) || !complete(end)) return
    if (start.isAfter(end)) return setRangeError(language['INVALID_RANGE'])
    setRangeError('')
    const apply = () => {
      setPage(0)
      // The end minute counts in full
      setApplied({ fromDate: start.toISOString(), toDate: end.clone().endOf('minute').toISOString() })
    }
    if (now) apply()
    else applyTimer.current = setTimeout(apply, 800)
  }

  const pickPreset = (unit: typeof presets[number]['unit']) => {
    changeRange(moment().startOf(unit).format(INPUT_FORMAT), moment().endOf(unit).format(INPUT_FORMAT), true)
  }
  const activePreset = presets.find(({ unit }) => from === moment().startOf(unit).format(INPUT_FORMAT) && to === moment().endOf(unit).format(INPUT_FORMAT))?.unit

  const selectSource = (key: ListKey) => {
    setSelected(key)
    setPage(0)
  }

  const colorOf = (value: number) => (value === 0 ? theme.text.secondary : value < 0 ? theme.color.error : theme.color.success)
  const box = { backgroundColor: theme.background.secondary, borderRadius: theme.radius.ternary, padding: 15 }
  const cell = { padding: '8px 8px', textAlign: 'right' as const, whiteSpace: 'nowrap' as const }

  const columns: ITableColumn<string>[] = [
    { id: 'invoice', label: language['INVOICE'], minWidth: 90 },
    ...(selected === 'all' ? [{ id: 'source', label: language['INCOME_SOURCE'], minWidth: 110 }] : []),
    { id: 'date', label: language['DATE_TIME'], minWidth: 130, noWrap: true },
    { id: 'income', label: language['INCOME'], minWidth: 80, align: 'right' },
    ...(isProfit ? [
      { id: 'cost', label: language['COST'], minWidth: 100, align: 'right' as const, noWrap: true },
      { id: 'profit', label: language['PROFIT'], minWidth: 80, align: 'right' as const },
    ] : []),
  ]

  const tableRows = rows.map((row) => ({
    id: row.id,
    invoice: row.invoice || '--',
    source: <span style={{ fontSize: 13, color: theme.text.secondary }}>{language[sourceText[row.source]?.[0]]}</span>,
    date: timeFormat(row.date, 'YYYY-MM-DD HH:mm'),
    income: money(row.income),
    // A loan payment carries its share of the items' cost
    cost: row.installmentCount
      ? <span style={{ whiteSpace: 'nowrap' }}>{money(row.fullCost || 0)} ÷ {row.installmentCount} = {money(row.cost)}</span>
      : money(row.cost),
    profit: <span style={{ color: colorOf(row.profit) }}>{money(row.profit)}</span>,
  }))

  // The list's total: one source's, or the whole formula's
  const selectedSource = selected === 'all' ? summary : summary?.sources.find((item) => item.key === selected)

  const calculation = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Date-time range */}
      <div style={box}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: theme.text.secondary, width: 34 }}>{language['FROM']}</span>
          <DateTimeInput styled={theme} type='datetime-local' value={from} onChange={(event) => changeRange(event.target.value, to)} onBlur={() => changeRange(from, to, true)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 13, color: theme.text.secondary, width: 34 }}>{language['TO']}</span>
          <DateTimeInput styled={theme} type='datetime-local' value={to} onChange={(event) => changeRange(from, event.target.value)} onBlur={() => changeRange(from, to, true)} />
        </div>
        {rangeError && <div style={{ fontSize: 12, color: theme.color.error, marginTop: 6 }}>{rangeError}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {presets.map(({ unit, label }) => {
            const active = activePreset === unit
            return (
              <button
                key={unit}
                type='button'
                onClick={() => pickPreset(unit)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: theme.radius.primary,
                  backgroundColor: active ? `${theme.color.info}26` : theme.background.primary,
                  color: active ? theme.color.info : theme.text.secondary,
                }}
              >
                {language[label]}
              </button>
            )
          })}
        </div>
      </div>

      {/* The formula, then the same with this range's numbers */}
      <div style={box}>
        <div style={{ fontSize: 14 }}>{isProfit ? language['PROFIT_FORMULA'] : language['INCOME_FORMULA']}</div>
        {summary && (
          <div style={{ fontSize: 12, color: theme.text.tertiary, marginTop: 4 }}>
            {timeFormat(summary.from, 'YYYY-MM-DD HH:mm')} – {timeFormat(summary.to, 'YYYY-MM-DD HH:mm')}
          </div>
        )}
        {summary && (
          <div style={{ fontSize: 19, marginTop: 8, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 6, opacity: summaryLoading ? 0.5 : 1 }}>
            {isProfit ? (
              <>
                <span>{money(summary.income)}</span>
                <span style={{ color: theme.text.tertiary }}>−</span>
                <span>{money(summary.cost)}</span>
                <span style={{ color: theme.text.tertiary }}>=</span>
                <span style={{ color: colorOf(summary.profit) }}>{money(summary.profit)}</span>
              </>
            ) : (
              <>
                {summary.sources.map((item, index) => (
                  <span key={item.key} style={{ display: 'inline-flex', gap: 6 }}>
                    {index > 0 && <span style={{ color: theme.text.tertiary }}>+</span>}
                    <span>{money(item.income)}</span>
                  </span>
                ))}
                <span style={{ color: theme.text.tertiary }}>=</span>
                <span style={{ color: colorOf(summary.income) }}>{money(summary.income)}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Each source; a click lists what's behind it */}
      <div style={{ ...box, padding: 5, opacity: summaryLoading ? 0.5 : 1, transition: 'opacity 0.15s' }}>
        {summaryError ? (
          <div style={{ padding: 15, textAlign: 'center', fontSize: 13, color: theme.color.error }}>
            <div>{summaryError}</div>
            <button
              type='button'
              onClick={() => setRetry((value) => value + 1)}
              style={{ marginTop: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: '4px 12px', borderRadius: theme.radius.primary, backgroundColor: `${theme.color.info}26`, color: theme.color.info }}
            >
              {language['RETRY']}
            </button>
          </div>
        ) : summary ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: theme.text.secondary }}>
                <th style={{ ...cell, textAlign: 'left' }}>{language['INCOME_SOURCE']}</th>
                <th style={cell}>{language['ROWS']}</th>
                <th style={cell}>{language['INCOME']}</th>
                {isProfit && <th style={cell}>{language['PROFIT']}</th>}
              </tr>
            </thead>
            <tbody>
              {summary.sources.map((item) => {
                const [name, description] = sourceText[item.key]
                const active = item.key === selected
                return (
                  <tr
                    key={item.key}
                    onClick={() => selectSource(item.key)}
                    style={{ cursor: 'pointer', backgroundColor: active ? `${theme.color.info}18` : undefined, opacity: item.count ? 1 : 0.55 }}
                  >
                    <td style={{ ...cell, textAlign: 'left', whiteSpace: 'normal' }}>
                      <div style={{ color: active ? theme.color.info : theme.text.primary }}>{language[name]}</div>
                      {isProfit && <div style={{ fontSize: 11, color: theme.text.tertiary }}>{language[description]}</div>}
                    </td>
                    <td style={cell}>{item.count}</td>
                    <td style={cell}>{money(item.income)}</td>
                    {isProfit && <td style={{ ...cell, color: colorOf(item.profit) }}>{money(item.profit)}</td>}
                  </tr>
                )
              })}
              {/* A click lists every source again */}
              <tr
                onClick={() => selectSource('all')}
                style={{ borderTop: theme.border.quaternary, fontWeight: 600, cursor: 'pointer', backgroundColor: selected === 'all' ? `${theme.color.info}18` : undefined }}
              >
                <td style={{ ...cell, textAlign: 'left', color: selected === 'all' ? theme.color.info : undefined }}>{language['TOTAL']}</td>
                <td style={cell}>{summary.sources.reduce((total, item) => total + item.count, 0)}</td>
                <td style={cell}>{money(summary.income)}</td>
                {isProfit && <td style={{ ...cell, color: colorOf(summary.profit) }}>{money(summary.profit)}</td>}
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: 160 }}><CircularProgress size={24} /></div>
        )}
      </div>

      <div style={{ fontSize: 12, color: theme.text.tertiary }}>
        {language['RIEL_NOTE']}{isProfit && ` ${language['COST_NOTE']}`}
      </div>
    </div>
  )

  const listing = (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: narrow ? 420 : 0, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, padding: '2px 4px 10px' }}>
        <span style={{ color: theme.text.primary, fontSize: 15 }}>{selected === 'all' ? language['ALL_SOURCES'] : language[sourceText[selected][0]]}</span>
        {(rowsTotal || selectedSource) && (() => {
          // What's listed: the search's matches, or the whole source
          const listed = rowsTotal || selectedSource!
          return (
            <span style={{ fontSize: 14, color: theme.text.secondary }}>
              {language['TOTAL']}:{' '}
              <span style={{ color: isProfit ? colorOf(listed.profit) : theme.text.primary }}>
                {money(isProfit ? listed.profit : listed.income)}
              </span>
            </span>
          )
        })()}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 10px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, height: 33, padding: '0 10px', boxSizing: 'border-box', border: theme.border.quaternary, borderRadius: theme.radius.primary }}>
          <SearchRoundedIcon style={{ fontSize: 18, color: theme.text.quaternary }} />
          <input
            value={searchText}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder={language['SEARCH_INVOICE']}
            aria-label={language['SEARCH_INVOICE']}
            style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none', color: theme.text.primary, fontFamily: 'inherit', fontSize: 13 }}
          />
        </div>
        <MiniSelectField
          name='sort'
          width={150}
          value={sort}
          options={[
            { label: language['NEWEST_FIRST'], value: 'desc' },
            { label: language['OLDEST_FIRST'], value: 'asc' },
          ]}
          onChange={(event) => {
            setPage(0)
            setSort(event.target.value === 'asc' ? 'asc' : 'desc')
          }}
        />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {!rowsLoading && !rows.length ? (
          <div style={{ ...box, textAlign: 'center', color: theme.text.quaternary, fontSize: 13 }}>{language['NOTHING_IN_PERIOD']}</div>
        ) : (
          <StickyTable
            // The page controls sit right under the rows, not at the
            // bottom of the dialog
            style={{ position: 'relative' }}
            columns={columns}
            rows={tableRows}
            loading={rowsLoading}
            count={count}
            skip={page}
            limit={limit}
            setQuery={(next) => {
              if (next.limit !== undefined) {
                setLimit(+next.limit)
                setPage(0)
              } else if (next.page !== undefined) {
                setPage(next.page)
              }
            }}
          />
        )}
      </div>
    </div>
  )

  return (
    <AlertDialog isOpen={!!type} handleClose={onClose}>
      <DialogTitle title={isProfit ? language['HOW_PROFIT_CALCULATED'] : language['HOW_INCOME_CALCULATED']} onClose={onClose} />
      <div
        style={{
          width: narrow ? '94vw' : 'min(1280px, 94vw)',
          height: narrow ? '82vh' : 'min(780px, 84vh)',
          boxSizing: 'border-box',
          padding: '0 10px 10px',
          color: theme.text.primary,
          display: 'flex',
          flexDirection: narrow ? 'column' : 'row',
          gap: 15,
          overflow: narrow ? 'auto' : 'hidden',
        }}
      >
        <div style={{ width: narrow ? '100%' : 400, flex: 'none', overflowY: narrow ? 'visible' : 'auto' }}>
          {calculation}
        </div>
        {listing}
      </div>
    </AlertDialog>
  )
}
