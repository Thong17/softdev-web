import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import { MiniSelectField } from 'components/shared/form'
import { DetailSection } from 'components/shared/container/DetailSection'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import StackedLineChartRoundedIcon from '@mui/icons-material/StackedLineChartRounded'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getReportSale, selectReportSale } from './redux'
import { currencyFormat } from 'utils/index'
import { CustomAreaChart } from 'components/shared/charts/AreaChart'
import moment from 'moment'
import useLanguage from 'hooks/useLanguage'

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
  const dispatch = useAppDispatch()
  const { language } = useLanguage()
  const { data } = useAppSelector(selectReportSale)
  const [selectedSaleChart, setSelectedSaleChart] = useState('day')
  const [selectedTotalIncome, setSelectedTotalIncome] = useState('day')
  const [selectedTotalProfit, setSelectedTotalProfit] = useState('day')
  const [queryParams, setQueryParams] = useSearchParams()
  
  const handleChangeGrande = (event) => {
    const { name, value } = event.target
    handleQuery({ [name]: value })
  }

  const handleQuery = (data) => {
    let query = {}
    const _totalIncome = queryParams.get('_totalIncome')
    const _totalProfit = queryParams.get('_totalProfit')
    const _chartData = queryParams.get('_chartData')

    if (_totalIncome) query = { _totalIncome, ...query }
    if (_totalProfit) query = { _totalProfit, ...query }
    if (_chartData) query = { _chartData, ...query }

    setQueryParams({ ...query, ...data })
  }

  useEffect(() => {
    const _totalIncome = queryParams.get('_totalIncome')
    const _totalProfit = queryParams.get('_totalProfit')
    const _chartData = queryParams.get('_chartData')

    if (_totalIncome) setSelectedTotalIncome(_totalIncome)
    if (_totalProfit) setSelectedTotalProfit(_totalProfit)
    if (_chartData) setSelectedSaleChart(_chartData)
    dispatch(getReportSale({query: queryParams}))
  }, [queryParams, dispatch])
  
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
                  onChange={handleChangeGrande}
                />
              </div>
            }
            data={<span style={{ fontSize: 23 }}>{currencyFormat(data.totalIncome, 'USD')}</span>}
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
                  onChange={handleChangeGrande}
                />
              </div>
            }
            data={<span style={{ fontSize: 23 }}>{currencyFormat(data.totalProfit, 'USD')}</span>}
            icon={<StackedLineChartRoundedIcon style={{ fontSize: 40 }} />}
          />
        </div>
        <CardContainer
          title={
            <>
              {language['CHART']}
              <div style={{ position: 'absolute', right: 10, top: 7 }}>
                <ListFilter
                  value={selectedSaleChart}
                  grades={filterOption}
                  name='_chartData'
                  onChange={handleChangeGrande}
                />
              </div>
            </>
          }
          style={{ gridArea: 'charts' }}
        >
          <CustomAreaChart data={data.listSale.map(item => ({ ...item, name: moment(item.name).format(item.format)}))} labels={[{ name: 'value' }]} height={370} />
        </CardContainer>
      </div>
    </Container>
  )
}
