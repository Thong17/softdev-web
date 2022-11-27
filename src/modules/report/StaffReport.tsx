import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import { MiniSelectField } from 'components/shared/form'
import { DetailSection } from 'components/shared/container/DetailSection'
import { getReportListStaff, getReportTopStaff } from './redux'
import { CustomAreaChart } from 'components/shared/charts/AreaChart'
import useLanguage from 'hooks/useLanguage'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import useNotify from 'hooks/useNotify'
import { styled } from '@mui/material'
import { IThemeStyle } from 'contexts/theme/interface'
import useTheme from 'hooks/useTheme'

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='staffReport' />
    </>
  )
}

const filterOption = [
  {
    label: 'Daily',
    value: 'day',
  },
  {
    label: 'Weekly',
    value: 'week',
  },
  {
    label: 'Monthly',
    value: 'month',
  },
  {
    label: 'Yearly',
    value: 'year',
  },
  {
    label: 'Range',
    value: 'range',
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

const DateInput = styled('input')(({ styled }: { styled: IThemeStyle }) => ({
  background: 'none',
  border: styled.border.quaternary,
  padding: 3,
  borderRadius: styled.radius.primary,
  color: styled.text.secondary,
  maxWidth: 100,
  '&[type="date"]::-webkit-calendar-picker-indicator, &[type="datetime-local"]::-webkit-calendar-picker-indicator':
    {
      filter: 'invert(0.5)',
    },
  '&:hover, &:focus': {
    border: styled.border.quaternary,
    outline: 'none',
  },
}))

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

export const StaffReport = () => {
  const { notify } = useNotify()
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [selectedSaleChart, setSelectedSaleChart] = useState('month')
  const [selectedTotalStaff, setSelectedTotalStaff] = useState('month')
  const [queryParams, setQueryParams] = useSearchParams()
  const [listStaff, setListStaff] = useState([])
  const [topStaff, setTopStaff] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    let query = new URLSearchParams()
    const _totalIncome = queryParams.get('_totalIncome')
    const _totalProfit = queryParams.get('_totalProfit')
    if (_totalIncome) query.append('_totalIncome', _totalIncome)
    if (_totalProfit) query.append('_totalProfit', _totalProfit)
    query.append('_chartData', 'range')

    if (fromDate === '' || toDate === '') return
    query.append('fromDate', fromDate)
    query.append('toDate', toDate)
    setQueryParams(query)

    getReportListStaff({ query })
      .then((data) => {
        setListStaff(data?.data)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line
  }, [fromDate, toDate])

  const handleChangeQuery = (event) => {
    const { name, value } = event.target
    let query = new URLSearchParams()
    const _topStaff = queryParams.get('_topStaff')
    const _chartData = queryParams.get('_chartData')

    switch (name) {
      case '_chartData':
        if (_topStaff) query.append('_topStaff', _topStaff)
        query.append('_chartData', value)

        if (value === 'range') {
          query.append('fromDate', fromDate)
          query.append('toDate', toDate)
        }

        setSelectedSaleChart(value)
        getReportListStaff({ query })
          .then((data) => {
            setListStaff(data?.data)
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
        break

      default:
        if (_chartData) query.append('_chartData', _chartData)
        query.append('_topStaff', value)

        setSelectedTotalStaff(value)
        getReportTopStaff({ query })
          .then((data) => {
            setTopStaff(data?.data)
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
        break
    }
    setQueryParams(query)
  }

  useEffect(() => {
    const _topStaff = queryParams.get('_topStaff')
    const _chartData = queryParams.get('_chartData')

    if (_chartData) setSelectedSaleChart(_chartData)
    if (_topStaff) setSelectedTotalStaff(_topStaff)

    getReportTopStaff({ query: queryParams })
      .then((data) => {
        setTopStaff(data?.data)
        getReportListStaff({ query: queryParams })
          .then((data) => {
            setListStaff(data?.data)
            setLoading(false)
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))

    // eslint-disable-next-line
  }, [])

  return (
    <Container header={<Header />}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: ` 
              'header header' 
              'charts charts'
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
            padding: 20,
          }}
        >
          <DetailSection
            title={language['STAFF']}
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListFilter
                  value={selectedTotalStaff}
                  grades={filterTotal}
                  name='_topStaff'
                  onChange={handleChangeQuery}
                />
              </div>
            }
            data={<span style={{ fontSize: 23 }}>{topStaff?.name}</span>}
            icon={
              <CircleIcon
                width={36.5}
                height={36.5}
                icon={topStaff?.picture?.filename}
                star={true}
              />
            }
          />
        </div>
        <CardContainer
          title={
            <>
              {language['PERFORMANCE_CHART']}
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
                {selectedSaleChart === 'range' && (
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 5 }}
                  >
                    <DateInput
                      styled={theme}
                      type='date'
                      name='fromDate'
                      id='fromDate'
                      value={fromDate}
                      onChange={(event) => setFromDate(event.target.value)}
                    />
                    <span
                      style={{
                        color: theme.text.secondary,
                        fontSize: 13,
                        lineHeight: 1,
                      }}
                    >
                      {language['TO']}
                    </span>
                    <DateInput
                      styled={theme}
                      type='date'
                      name='toDate'
                      id='toDate'
                      value={toDate}
                      onChange={(event) => setToDate(event.target.value)}
                    />
                  </div>
                )}
              </div>
            </>
          }
          style={{ gridArea: 'charts' }}
        >
          {!loading && (
            <CustomAreaChart
              data={listStaff?.map((item: any) => ({
                ...item,
                name: item.name,
              }))}
              labels={[{ name: 'value' }]}
              height={370}
            />
          )}
        </CardContainer>
      </div>
    </Container>
  )
}
