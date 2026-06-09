import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import { MiniSelectField } from 'components/shared/form'
import { DetailSection } from 'components/shared/container/DetailSection'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import StackedLineChartRoundedIcon from '@mui/icons-material/StackedLineChartRounded'
import { getReportListSale, getReportSale } from './redux'
import { currencyFormat } from 'utils/index'
import { CustomAreaChart } from 'components/shared/charts/AreaChart'
import moment from 'moment'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import { IconButton, styled } from '@mui/material'
import { IThemeStyle } from 'contexts/theme/interface'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import { ExpandableTable } from 'components/shared/table/ExpandableTable'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useAuth from 'hooks/useAuth'
import { getListPayment, selectListPayment } from './payment/redux'
import { columnData, createData } from './payment/constant'
import Axios from 'constants/functions/Axios'

const Header = ({ language, theme }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <ReportBreadcrumbs page='saleReport' />
    </div>
  )
}

const filterOption = [
  {
    label: 'Hourly',
    value: 'hourly',
  },
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Monthly',
    value: 'monthly',
  },
  {
    label: 'Yearly',
    value: 'yearly',
  },
]

const filterTotal = [
  {
    label: 'Today',
    value: 'day',
  },
  {
    label: 'This Week',
    value: 'week',
  },
  {
    label: 'This Month',
    value: 'month',
  },
  {
    label: 'This Year',
    value: 'year',
  },
]

const DateInput = styled('input')(
  ({ styled }: { styled: IThemeStyle }) => ({
    background: 'none',
    border: styled.border.quaternary,
    padding: 3,
    borderRadius: styled.radius.primary,
    color: styled.text.secondary,
    maxWidth: 100,
    '&[type="date"]::-webkit-calendar-picker-indicator, &[type="datetime-local"]::-webkit-calendar-picker-indicator': {
      filter: 'invert(0.5)'
    },
    '&:hover, &:focus': {
      border: styled.border.quaternary,
      outline: 'none'
    },
  })
)

const ListFilter = ({ grades, name, value = '', onChange }) => {
  return (
    <MiniSelectField
      name={name}
      value={value}
      options={grades}
      onChange={(event) => onChange(event)}
    />
  )
}

export const SaleReportRowDetail = ({
  row,
  rowDetails,
  detailLoading,
  theme,
  language,
}: {
  row: any
  rowDetails: Record<string, any[]>
  detailLoading: Record<string, boolean>
  theme: any
  language: any
}) => {
  const transactions = rowDetails[row.id] || []
  const loadingDetail = detailLoading[row.id]

  const formattedPrice = (item) => {
    if (!item) return '-'
    const price = item.price?.value ?? item.total?.value
    const currency = item.price?.currency ?? item.total?.currency ?? 'USD'
    return price !== null && price !== undefined ? currencyFormat(price, currency) : '-'
  }

  let detailContent: React.ReactNode

  if (loadingDetail) {
    detailContent = <div>{language['LOADING'] || 'Loading...'}</div>
  } else if (transactions?.length) {
    detailContent = (
      <div style={{ display: 'grid', gap: 4 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '50px 2fr 100px 100px 100px 100px',
            padding: '6px 10px',
            borderBottom: `1px solid ${theme.border.primary}`,
            backgroundColor: theme.background.secondary,
            fontSize: 13,
            fontWeight: 600,
            borderRadius: '5px',
          }}
        >
          <div>#</div>
          <div>{language['DESCRIPTION'] || 'Description'}</div>
          <div style={{ textAlign: 'right' }}>{language['PRICE'] || 'Price'}</div>
          <div style={{ textAlign: 'right' }}>{language['QUANTITY'] || 'Qty'}</div>
          <div style={{ textAlign: 'right' }}>{language['DISCOUNT'] || 'Disc'}</div>
          <div style={{ textAlign: 'right' }}>{language['TOTAL'] || 'Total'}</div>
        </div>
        {transactions.map((item: any, index: number) => (
          <div
            key={`${row.id}-detail-${index}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '50px 2fr 100px 100px 100px 100px',
              padding: '6px 10px',
              borderBottom: index < transactions.length - 1 ? `1px solid ${theme.border.primary}` : 'none',
              fontSize: 13,
              backgroundColor: item.isDeleted ? theme.color.error + '20' : 'transparent',
              color: item.isDeleted ? theme.color.error : theme.text.primary,
              borderRadius: '5px',
            }}
          >
            <div>{index + 1}</div>
            <div>{item.description || item.product || '-'}</div>
            <div style={{ textAlign: 'right' }}>{formattedPrice(item)}</div>
            <div style={{ textAlign: 'right' }}>{item.quantity ?? '-'}</div>
            <div style={{ textAlign: 'right' }}>{item.discount.isFixed ? 'Fixed' : ''} {currencyFormat(item.discount.value, item.discount.type)}</div>
            <div style={{ textAlign: 'right' }}>{item.total ? currencyFormat(item.total.value, item.total.currency) : '-'}</div>
          </div>
        ))}
      </div>
    )
  } else {
    detailContent = <div>{language['NO_DATA'] || 'No items found'}</div>
  }

  return <div style={{ padding: 12 }}>{detailContent}</div>
}

export const SaleReport = () => {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const { user } = useAuth()
  const [selectedSaleChart, setSelectedSaleChart] = useState('hourly')
  const [selectedTotalIncome, setSelectedTotalIncome] = useState('day')
  const [selectedTotalProfit, setSelectedTotalProfit] = useState('day')
  const [listSale, setListSale] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isExpandedChart, setIsExpandedChart] = useState(true)
  const [reportList, setReportList] = useState<any[]>([])
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [rowDetails, setRowDetails] = useState<Record<string, any[]>>({})
  const [detailLoading, setDetailLoading] = useState<Record<string, boolean>>({})
  const { data: payments, count, status } = useAppSelector(selectListPayment)
  const dispatch = useAppDispatch()

  // Load date filter from query params on mount
  useEffect(() => {
    const _fromDate = queryParams.get('fromDate')
    const _toDate = queryParams.get('toDate')
    const _totalIncome = queryParams.get('_totalIncome') ?? 'day'
    const _totalProfit = queryParams.get('_totalProfit') ?? 'day'
    const _chartData = queryParams.get('_chartData')

    if (_fromDate) setFromDate(_fromDate)
    if (_toDate) setToDate(_toDate)
    if (_chartData) setSelectedSaleChart(_chartData)
    if (_totalProfit) setSelectedTotalProfit(_totalProfit)
    if (_totalIncome) setSelectedTotalIncome(_totalIncome)
    // eslint-disable-next-line
  }, [])

  const toggleRowExpansion = async (id: string) => {
    if (expandedRows.includes(id)) {
      setExpandedRows((prev) => prev.filter((rowId) => rowId !== id))
      return
    }

    setExpandedRows((prev) => [...prev, id])
    if (rowDetails[id]) return

    setDetailLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const response = await Axios({
        url: `/sale/payment/detail/${id}`,
        method: 'GET',
      })
      const detailData = response?.data?.data
      setRowDetails((prev) => ({
        ...prev,
        [id]: detailData?.transactions || [],
      }))
    } catch (err: any) {
      notify(err?.response?.data?.msg, 'error')
    } finally {
      setDetailLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  useEffect(() => {
    const listTransactions = payments.map((payment: any) => {
      return createData(
        payment._id,
        payment.invoice,
        payment.paymentMethod?.toUpperCase(),
        currencyFormat(payment.subtotal.BOTH, 'USD'),
        currencyFormat(
            payment.vouchers[0]?.value,
            payment.vouchers[0]?.type,
        ),
        currencyFormat(
            payment.discounts[0]?.value,
            payment.discounts[0]?.type,
        ),
        currencyFormat(
            payment.services[0]?.value,
            payment.services[0]?.type,
        ),
        currencyFormat(payment.total.value, payment.total.currency),
        payment.state,
        payment.createdAt,
        payment.createdBy?.username,
        null,
        theme,
      )
    })

    setReportList(listTransactions)
  }, [payments, user, theme, notify])
  
  const handleChangeQuery = (event) => {
    const { name, value } = event.target
    switch (name) {
      case '_chartData':
        setSelectedSaleChart(value)
        const query = {
          _chartData: value,
        }

        if (fromDate && toDate) {
          query['fromDate'] = fromDate
          query['toDate'] = toDate
        }
        handleQuery(query)
        break

      case '_totalIncome':
        setSelectedTotalIncome(value)
        handleQuery({
          _totalIncome: value,
        })
        break

      default:
        setSelectedTotalProfit(value)
        handleQuery({
          _totalProfit: value,
        })
        break
    }
  }

  useEffect(() => {
    dispatch(getListPayment({ query: queryParams }))
    

    getReportSale({ query: queryParams })
      .then((data) => {
        setTotalProfit(data?.data?.totalProfit)
        setTotalIncome(data?.data?.totalIncome)
        getReportListSale({ query: queryParams })
          .then((data) => {
            setListSale(data?.data)
            setLoading(false)
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line
  }, [queryParams])

  const handleQuery = (data) => {
    let { limit, search } = data

    let query = {}
    const _limit = queryParams.get('limit')
    const _page = queryParams.get('page')
    const _search = queryParams.get('search')
    const _filter = queryParams.get('filter')
    const _sort = queryParams.get('sort')
    const _chartData = queryParams.get('_chartData')
    const _totalIncome = queryParams.get('_totalIncome')
    const _totalProfit = queryParams.get('_totalProfit')
    const _fromDate = queryParams.get('fromDate')
    const _toDate = queryParams.get('toDate')

    if (_limit) query = { limit: _limit, ...query }
    if (_page) query = { page: _page, ...query }
    if (_search) query = { search: _search, ...query }
    if (_filter) query = { filter: _filter, ...query }
    if (_sort) query = { sort: _sort, ...query }
    if (_chartData) query = { _chartData, ...query }
    if (_totalIncome) query = { _totalIncome, ...query }
    if (_totalProfit) query = { _totalProfit, ...query }
    if (_fromDate) query = { fromDate: _fromDate, ...query }
    if (_toDate) query = { toDate: _toDate, ...query }

    if (limit || search) return setQueryParams({ ...query, ...data, page: 0 })
    setQueryParams({ ...query, ...data })
  }

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value
    // If toDate exists and is less than new fromDate, show error
    if (toDate && newFromDate && new Date(newFromDate) > new Date(toDate)) {
      notify('Start date cannot be after end date', 'error')
      return
    }
    setFromDate(newFromDate)
    handleQuery({ fromDate: newFromDate })
  }

  const handleToDateChange = (e) => {
    const newToDate = e.target.value
    // If fromDate exists and new toDate is less than fromDate, show error
    if (fromDate && newToDate && new Date(newToDate) < new Date(fromDate)) {
      notify('End date cannot be before start date', 'error')
      return
    }
    setToDate(newToDate)
    handleQuery({ toDate: newToDate })
  }

  return (
    <Container header={
      <Header
        language={language}
        theme={theme}
      />
    }>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: ` 
              'header header' 
              'filter filter'
              'charts charts'
              'table table'
            `,
        }}
      >
        <div
          style={{
            gridArea: 'header',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            overflowX: 'auto',
            paddingBlock: 20,
          }}
        >
          <DetailSection
            title={language['INCOME']}
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListFilter
                  value={selectedTotalIncome}
                  grades={filterTotal}
                  name='_totalIncome'
                  onChange={handleChangeQuery}
                />
              </div>
            }
            data={
              <span
                style={{
                  fontSize: 23,
                  color:
                    totalIncome === 0
                      ? theme.text.secondary
                      : totalIncome < 0
                      ? theme.color.error
                      : theme.color.success,
                }}
              >
                <span>{totalIncome < 0 ? '-' : '+'}</span>
                {currencyFormat(totalIncome, 'USD')}
              </span>
            }
            icon={
              <StackedLineChartRoundedIcon
                style={{
                  fontSize: 40,
                  color:
                    totalIncome === 0
                      ? theme.text.secondary
                      : totalIncome < 0
                      ? theme.color.error
                      : theme.color.success,
                }}
              />
            }
          />
          <DetailSection
            title={language['PROFIT']}
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListFilter
                  value={selectedTotalProfit}
                  grades={filterTotal}
                  name='_totalProfit'
                  onChange={handleChangeQuery}
                />
              </div>
            }
            data={
              <span
                style={{
                  fontSize: 23,
                  color:
                    totalProfit === 0
                      ? theme.text.secondary
                      : totalProfit < 0
                      ? theme.color.error
                      : theme.color.success,
                }}
              >
                <span>{totalProfit < 0 ? '' : '+'}</span>
                {currencyFormat(totalProfit, 'USD')}
              </span>
            }
            icon={
              <ShowChartRoundedIcon
                style={{
                  fontSize: 40,
                  color:
                    totalProfit === 0
                      ? theme.text.secondary
                      : totalProfit < 0
                      ? theme.color.error
                      : theme.color.success,
                }}
              />
            }
          />
        </div>
        <div
          style={{
            gridArea: 'filter',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
            paddingBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, color: theme.text.secondary }}>{language['FROM'] || 'From'}:</span>
              <DateInput styled={theme} type='date' name='fromDate' value={fromDate} onChange={handleFromDateChange} />
            </div>
            <span style={{ color: theme.text.secondary, fontSize: 13 }}>{language['TO'] || 'To'}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <DateInput styled={theme} type='date' name='toDate' value={toDate} onChange={handleToDateChange} />
            </div>
          </div>
        </div>
        <CardContainer
          title={
            <>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <IconButton onClick={() => setIsExpandedChart(!isExpandedChart)} aria-label="delete" size="small" style={{ color: theme.text.primary }}>
                  {isExpandedChart ? <KeyboardArrowUpRoundedIcon fontSize="small" /> : <KeyboardArrowDownRoundedIcon fontSize="small" />}
                </IconButton>
                {language['INCOME_CHART']}
              </div>
              <div 
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  right: 0,
                  top: 7,
                }}
              >
                <ListFilter
                  value={selectedSaleChart}
                  grades={filterOption}
                  name='_chartData'
                  onChange={handleChangeQuery}
                />
              </div>
            </>
          }
          style={{ gridArea: 'charts' }}
        >
          {(!loading && isExpandedChart) && (
            <CustomAreaChart
              data={listSale.map((item: any) => ({
                ...item,
                name: moment(item.name).format(item.format),
                createdAt: moment(item.name).format('YYYY-MM-DD'),
              }))}
              labels={[{ name: 'value' }]}
              height={370}
            />
          )} 
        </CardContainer>
        <div style={{ paddingBlock: '20px', width: '100%', gridArea: 'table', paddingTop: "20px" }}>
          <ExpandableTable
            columns={columnData.filter((col) => col.id !== 'action')}
            rows={reportList}
            setQuery={handleQuery}
            handleClick={toggleRowExpansion}
            expandedRowIds={expandedRows}
            renderRowDetail={(row) => (
              <SaleReportRowDetail
                row={row}
                rowDetails={rowDetails}
                detailLoading={detailLoading}
                theme={theme}
                language={language}
              />
            )}
            count={count}
            limit={Number.parseInt(queryParams.get('limit') || '10')}
            skip={
                status === 'SUCCESS'
                    ? Number.parseInt(queryParams.get('page') || '0')
                    : 0
            }
          />
        </div>
      </div>
    </Container>
  )
}
