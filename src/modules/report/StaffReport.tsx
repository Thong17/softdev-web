import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import { MiniSelectField } from 'components/shared/form'
import { DetailSection } from 'components/shared/container/DetailSection'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getReportStaff, selectReportStaff } from './redux'
import { CustomAreaChart } from 'components/shared/charts/AreaChart'
import useLanguage from 'hooks/useLanguage'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'

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

export const StaffReport = () => {
  const dispatch = useAppDispatch()
  const { language } = useLanguage()
  const { data } = useAppSelector(selectReportStaff)
  const [selectedSaleChart, setSelectedSaleChart] = useState('day')
  const [selectedTotalStaff, setSelectedTotalStaff] = useState('day')
  const [queryParams, setQueryParams] = useSearchParams()
  
  const handleChangeGrande = (event) => {
    const { name, value } = event.target
    handleQuery({ [name]: value })
  }

  const handleQuery = (data) => {
    let query = {}
    const _topStaff = queryParams.get('_topStaff')
    const _chartData = queryParams.get('_chartData')

    if (_topStaff) query = { _topStaff, ...query }
    if (_chartData) query = { _chartData, ...query }

    setQueryParams({ ...query, ...data })
  }

  useEffect(() => {
    const _topStaff = queryParams.get('_topStaff')
    const _chartData = queryParams.get('_chartData')

    if (_topStaff) setSelectedTotalStaff(_topStaff)
    if (_chartData) setSelectedSaleChart(_chartData)
    dispatch(getReportStaff({query: queryParams}))
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
            title={language['STAFF']}
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListFilter
                  value={selectedTotalStaff}
                  grades={filterTotal}
                  name='_topStaff'
                  onChange={handleChangeGrande}
                />
              </div>
            }
            data={<span style={{ fontSize: 23 }}>{data.topStaff?.name}</span>}
            icon={<EmojiEventsRoundedIcon style={{ fontSize: 40 }} />}
          />
        </div>
        <CardContainer
          title={
            <>
              {language['PERFORMANCE_CHART']}
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
          <CustomAreaChart data={data.listStaff.map(item => ({ ...item, name: item.name}))} labels={[{ name: 'value' }]} height={370} />
        </CardContainer>
      </div>
    </Container>
  )
}
