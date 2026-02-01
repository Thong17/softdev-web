import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import Navbar from './components/Navbar'
import SaleBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { DetailSection } from 'components/shared/container/DetailSection'
import useTheme from 'hooks/useTheme'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { useEffect, useState } from 'react'
import { getOperationDashboard, selectOperationDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import useWeb from 'hooks/useWeb'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'
import DiscountRoundedIcon from '@mui/icons-material/DiscountRounded'

const Header = () => {
  return (
    <>
      <SaleBreadcrumbs page='sale' />
    </>
  )
}

export const Sale = () => {
  const outlet = useOutlet()
  const { width } = useWeb()
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const [totalTransaction, setTotalTransaction] = useState(0)
  const [totalReservation, setTotalReservation] = useState(0)
  const [totalStock, setTotalStock] = useState(0)
  const [totalPromotion, setTotalPromotion] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [reservations, setReservations] = useState([])
  const [stocks, setStocks] = useState([])
  const [promotions, setPromotions] = useState([])

  const dispatch = useAppDispatch()
  const location = useLocation()
  const { data: dashboard } = useAppSelector(selectOperationDashboard)

  useEffect(() => {
    const mappedCategory = dashboard?.transactions?.map((item) => {
      const fill =
        item.id === 'completed' ? theme.color.success : theme.color.error
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.name,
        detail: item.title,
        fill,
      }
    })
    setTransactions(mappedCategory)

    const mappedBrand = dashboard?.reservations?.map((item) => {
      let fill
      switch (item.id) {
        case 'reserved':
          fill = theme.color.warning
          break
        case 'occupied':
          fill = theme.color.error
          break
        default:
          fill = theme.color.info
          break
      }
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.name,
        detail: item.title,
        fill,
      }
    })
    setReservations(mappedBrand)

    const mappedFloor = dashboard?.stocks?.map((item) => {
      let fill
      switch (item.id) {
        case 'remain':
          fill = theme.color.info
          break
        case 'alert':
          fill = theme.color.warning
          break
        default:
          fill = theme.color.error
          break
      }
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.name,
        detail: item.title,
        fill,
      }
    })
    setStocks(mappedFloor)

    const mappedProduct = dashboard?.promotions?.map((item) => {
      const fill = item.id === 'expire' ? theme.color.error : theme.color.info
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.name,
        detail: item.title,
        fill,
      }
    })
    setPromotions(mappedProduct)

    setTotalTransaction(dashboard?.totalTransaction)
    setTotalReservation(dashboard?.totalReservation)
    setTotalStock(dashboard?.totalStock)
    setTotalPromotion(dashboard?.totalPromotion)
  }, [dashboard, lang, theme])

  useEffect(() => {
    if (location.pathname !== '/sale') return
    dispatch(getOperationDashboard())
  }, [dispatch, location.pathname])

  return (
    <Layout navbar={<Navbar />}>
      {outlet || (
        <Container header={<Header />}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridGap: 20,
              gridTemplateAreas:
                width < 1024
                  ? ` 
                'header header' 
                'transaction transaction'
                'reservation reservation'
                'stock stock'
                'promotion promotion'
              `
                  : ` 
                'header header' 
                'transaction reservation'
                'stock promotion'
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
                title={language['TOTAL_TRANSACTION']}
                data={totalTransaction}
                icon={<ReceiptRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title={language['TOTAL_RESERVATION']}
                data={totalReservation}
                icon={<TodayRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title={language['TOTAL_STOCK']}
                data={totalStock}
                icon={<Inventory2RoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title={language['TOTAL_PROMOTION']}
                data={totalPromotion}
                icon={<DiscountRoundedIcon style={{ fontSize: 40 }} />}
              />
            </div>
            <CardContainer
              title={<>{language['TRANSACTION']}</>}
              style={{ gridArea: 'transaction' }}
            >
              <CustomPieChart
                data={transactions}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer
              title={<>{language['RESERVATION']}</>}
              style={{ gridArea: 'reservation' }}
            >
              <CustomPieChart
                data={reservations}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer title={<>{language['STOCK']}</>} style={{ gridArea: 'stock' }}>
              <CustomPieChart
                data={stocks}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer
              title={<>{language['PROMOTION']}</>}
              style={{ gridArea: 'promotion' }}
            >
              <CustomPieChart
                data={promotions}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
          </div>
        </Container>
      )}
    </Layout>
  )
}

export { Reservation, ReservationForm } from './reservation'
export { Cashing } from './cashing'
export { Stocks, Stock } from './stock'
