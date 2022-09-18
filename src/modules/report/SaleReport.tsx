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

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='saleReport' />
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

export const SaleReport = () => {
  const { language } = useLanguage()
  const { notify } = useNotify()
  const [selectedSaleChart, setSelectedSaleChart] = useState('day')
  const [selectedTotalIncome, setSelectedTotalIncome] = useState('day')
  const [selectedTotalProfit, setSelectedTotalProfit] = useState('day')
  const [listSale, setListSale] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [queryParams, setQueryParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  
  const handleChangeQuery = (event) => {
    const { name, value } = event.target
    let query = new URLSearchParams()
    const _totalIncome = queryParams.get('_totalIncome')
    const _totalProfit = queryParams.get('_totalProfit')
    const _chartData = queryParams.get('_chartData')

    switch (name) {
      case '_chartData':
        if (_totalIncome) query.append('_totalIncome', _totalIncome)
        if (_totalProfit) query.append('_totalProfit', _totalProfit)
        query.append('_chartData', value)

        setSelectedSaleChart(value)
        getReportListSale({query})
          .then(data => {
            setListSale(data?.data)
          })
          .catch(err => notify(err?.response?.data?.msg, 'error'))
        break

      case '_totalIncome':
        if (_chartData) query.append('_chartData', _chartData)
        if (_totalProfit) query.append('_totalProfit', _totalProfit)
        query.append('_totalIncome', value)

        setSelectedTotalIncome(value)
        getReportSale({query})
          .then(data => {
            setTotalProfit(data?.data?.totalProfit)
            setTotalIncome(data?.data?.totalIncome)
          })
          .catch(err => notify(err?.response?.data?.msg, 'error'))
        break
    
      default:
        if (_chartData) query.append('_chartData', _chartData)
        if (_totalIncome) query.append('_totalIncome', _totalIncome)
        query.append('_totalProfit', value)

        setSelectedTotalProfit(value)
        getReportSale({query})
          .then(data => {
            setTotalProfit(data?.data?.totalProfit)
            setTotalIncome(data?.data?.totalIncome)
          })
          .catch(err => notify(err?.response?.data?.msg, 'error'))
        break
    }
    setQueryParams(query)
  }

  useEffect(() => {
    const _totalIncome = queryParams.get('_totalIncome')
    const _totalProfit = queryParams.get('_totalProfit')
    const _chartData = queryParams.get('_chartData')

    if (_chartData) setSelectedSaleChart(_chartData)
    if (_totalProfit) setSelectedTotalProfit(_totalProfit)
    if (_totalIncome) setSelectedTotalIncome(_totalIncome)

    getReportSale({query: queryParams})
      .then(data => {
        setTotalProfit(data?.data?.totalProfit)
        setTotalIncome(data?.data?.totalIncome)
        getReportListSale({query: queryParams})
          .then(data => {
            setListSale(data?.data)
            setLoading(false)
          })
          .catch(err => notify(err?.response?.data?.msg, 'error'))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
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
            data={<span style={{ fontSize: 23 }}>{currencyFormat(totalIncome, 'USD')}</span>}
            icon={<ShowChartRoundedIcon style={{ fontSize: 40 }} />}
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
            data={<span style={{ fontSize: 23 }}>{currencyFormat(totalProfit, 'USD')}</span>}
            icon={<StackedLineChartRoundedIcon style={{ fontSize: 40 }} />}
          />
        </div>
        <CardContainer
          title={
            <>
              {language['INCOME_CHART']}
              <div style={{ position: 'absolute', right: 10, top: 7 }}>
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
          {!loading && <CustomAreaChart data={listSale.map((item: any) => ({ ...item, name: moment(item.name).format(item.format)}))} labels={[{ name: 'value' }]} height={370} />}
        </CardContainer>
      </div>
    </Container>
  )
}
