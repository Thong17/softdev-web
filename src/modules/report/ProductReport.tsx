import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import { MiniSelectField } from 'components/shared/form'
import { DetailSection } from 'components/shared/container/DetailSection'
import { getReportTopProduct, getReportListProduct } from './redux'
import { CustomBarChart } from 'components/shared/charts/BarChart'
import useLanguage from 'hooks/useLanguage'
import { generateColor } from 'utils/index'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import useNotify from 'hooks/useNotify'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import { IconButton, styled } from '@mui/material'
import { IThemeStyle } from 'contexts/theme/interface'
import useTheme from 'hooks/useTheme'

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='productReport' />
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

export const ProductReport = () => {
  const { notify } = useNotify()
  const { language, lang } = useLanguage()
  const { theme } = useTheme()
  const [selectedSaleChart, setSelectedSaleChart] = useState('month')
  const [selectedTopProduct, setSelectedTopProduct] = useState('month')
  const [queryParams, setQueryParams] = useSearchParams()
  const [listProduct, setListProduct] = useState([])
  const [topProduct, setTopProduct] = useState<any>(null)
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

    getReportListProduct({ query })
      .then((data) => {
        setListProduct(data?.data)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line
  }, [fromDate, toDate])

  const handleChangeQuery = (event) => {
    const { name, value } = event.target
    let query = new URLSearchParams()
    const _topProduct = queryParams.get('_topProduct')
    const _chartData = queryParams.get('_chartData')

    switch (name) {
      case '_chartData':
        if (_topProduct) query.append('_topProduct', _topProduct)
        query.append('_chartData', value)

        if (value === 'range') {
          query.append('fromDate', fromDate)
          query.append('toDate', toDate)
        }

        setSelectedSaleChart(value)
        getReportListProduct({ query })
          .then((data) => {
            setListProduct(data?.data)
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
        break

      default:
        if (_chartData) query.append('_chartData', _chartData)
        query.append('_topProduct', value)

        setSelectedTopProduct(value)
        getReportTopProduct({ query })
          .then((data) => {
            setTopProduct(data?.data)
          })
          .catch((err) => notify(err?.response?.data?.msg, 'error'))
        break
    }
    setQueryParams(query)
  }

  useEffect(() => {
    const _topProduct = queryParams.get('_topProduct')
    const _chartData = queryParams.get('_chartData')

    if (_chartData) setSelectedSaleChart(_chartData)
    if (_topProduct) setSelectedTopProduct(_topProduct)

    getReportTopProduct({ query: queryParams })
      .then((data) => {
        setTopProduct(data?.data)
        getReportListProduct({ query: queryParams })
          .then((data) => {
            setListProduct(data?.data)
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
            title={language['TOP_PRODUCT']}
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListFilter
                  value={selectedTopProduct}
                  grades={filterTotal}
                  name='_topProduct'
                  onChange={handleChangeQuery}
                />
              </div>
            }
            data={
              <span style={{ fontSize: 23 }}>
                {topProduct?.name?.[lang] || topProduct?.name?.['English']}
              </span>
            }
            icon={
              <CircleIcon
                width={36.5}
                height={36.5}
                icon={topProduct?.picture}
                star={true}
              />
            }
          />
        </div>
        <CardContainer
          title={
            <>
              {language['CHART']}
              <div
                style={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  right: 10,
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
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
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
                <IconButton>
                  <FileDownloadRoundedIcon
                    style={{ color: theme.text.tertiary, fontSize: 21 }}
                  />
                </IconButton>
              </div>
            </>
          }
          style={{ gridArea: 'charts' }}
        >
          {!loading && (
            <CustomBarChart
              data={listProduct?.map((item: any) => ({
                ...item,
                fill: `${generateColor()}33`,
                name: item.name?.[lang] || item.name?.['English'],
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
