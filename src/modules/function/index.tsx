import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useEffect, useMemo } from 'react'
import { getFunctionDashboard, selectFunctionDashboard } from 'shared/redux'
import { useLocation, useNavigate } from 'react-router-dom'
import useWeb from 'hooks/useWeb'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'
import { DetailSection } from 'components/shared/container/DetailSection'
import { CardContainer } from 'components/shared/container/CardContainer'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { generateColor } from 'utils/index'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import ViewCarouselRoundedIcon from '@mui/icons-material/ViewCarouselRounded'
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='function' title='Dashboard' />
    </>
  )
}

// Fixed colours where the meaning is fixed (active, overdue…)
const STATUS_COLOR = {
  ACTIVE: '#2e9e5b',
  SCHEDULED: '#2f80ed',
  EXPIRED: '#7b7d7d',
  NOT_DUE: '#2f80ed',
  OVERDUE: '#d64545',
  INDIVIDUAL: '#2f80ed',
  BUSINESS: '#f2994a',
}

export const Function = () => {
  const outlet = useOutlet()
  const { width } = useWeb()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { data: dashboard } = useAppSelector(selectFunctionDashboard)

  useEffect(() => {
    if (location.pathname !== '/function') return
    dispatch(getFunctionDashboard())
  }, [dispatch, location.pathname])

  // The server only sends the parts this user may see
  const charts = useMemo(() => {
    const list: { key: string, title: string, data: any[] }[] = []
    if (dashboard?.customerTiers) {
      list.push({
        key: 'tier',
        title: language['TIER'],
        data: dashboard.customerTiers.map((item) => ({
          name: item.name || language['NO_TIER'],
          value: item.value,
          title: language['CUSTOMER'],
          detail: item.name || language['NO_TIER'],
          fill: item.color || '#7b7d7d',
        })),
      })
    }
    if (dashboard?.customerTypes) {
      list.push({
        key: 'type',
        title: language['CUSTOMER_TYPE'],
        data: dashboard.customerTypes.map((item) => ({
          name: language[item.id],
          value: item.value,
          title: language['CUSTOMER'],
          detail: language[item.id],
          fill: STATUS_COLOR[item.id] || generateColor(),
        })),
      })
    }
    if (dashboard?.promotions) {
      list.push({
        key: 'promotion',
        title: language['PROMOTION'],
        data: dashboard.promotions.map((item) => ({
          name: language[item.id],
          value: item.value,
          title: language['PROMOTION'],
          detail: language[item.id],
          fill: STATUS_COLOR[item.id],
        })),
      })
    }
    if (dashboard?.payLater) {
      list.push({
        key: 'payLater',
        title: language['PAY_LATER'],
        data: dashboard.payLater.map((item) => ({
          name: language[item.id],
          value: item.value,
          title: language['INVOICE'],
          detail: `$${Number(item.amount || 0).toFixed(2)}`,
          fill: STATUS_COLOR[item.id],
        })),
      })
    }
    return list
  }, [dashboard, language])

  return (
    <Layout navbar={<Navbar />}>
      {outlet || (
        <Container header={<Header />}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: width < 1024 ? '1fr' : '1fr 1fr',
              gridGap: 20,
            }}
          >
            <div
              style={{
                gridColumn: '1 / -1',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                overflowX: 'auto',
                padding: 20,
              }}
            >
              {dashboard?.totalCustomer !== undefined && (
                <DetailSection
                  title={language['TOTAL_CUSTOMER']}
                  data={dashboard.totalCustomer}
                  icon={<GroupsRoundedIcon style={{ fontSize: 40 }} />}
                />
              )}
              {dashboard?.dueCustomers !== undefined && (
                // Opens the customer list showing only customers who owe,
                // largest balance first
                <div
                  role='button'
                  tabIndex={0}
                  title={language['SHOW_DUE_CUSTOMERS']}
                  onClick={() => navigate('/function/customer?owing=true&filter=balance&sort=desc')}
                  onKeyDown={(event) => event.key === 'Enter' && navigate('/function/customer?owing=true&filter=balance&sort=desc')}
                  style={{ cursor: 'pointer', borderRadius: theme.radius.secondary }}
                >
                  <DetailSection
                    title={language['DUE_CUSTOMER']}
                    data={dashboard.dueCustomers}
                    icon={<PersonSearchRoundedIcon style={{ fontSize: 40 }} />}
                    header={dashboard.overdueCustomers > 0 && (
                      <span style={{ marginLeft: 10, padding: '1px 8px', borderRadius: theme.radius.primary, backgroundColor: `${theme.color.error}22`, color: theme.color.error, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {dashboard.overdueCustomers} {language['OVERDUE']}
                      </span>
                    )}
                  />
                </div>
              )}
              {dashboard?.activePromotion !== undefined && (
                <DetailSection
                  title={language['ACTIVE_PROMOTION']}
                  data={dashboard.activePromotion}
                  icon={<LocalOfferRoundedIcon style={{ fontSize: 40 }} />}
                />
              )}
              {dashboard?.activeBanner !== undefined && (
                <DetailSection
                  title={language['SHOWING_BANNER']}
                  data={dashboard.activeBanner}
                  icon={<ViewCarouselRoundedIcon style={{ fontSize: 40 }} />}
                />
              )}
              {dashboard?.payLaterOwing !== undefined && (
                <DetailSection
                  title={language['PAY_LATER_OWED']}
                  data={`$${Number(dashboard.payLaterOwing).toFixed(2)}`}
                  icon={<EventRepeatRoundedIcon style={{ fontSize: 40 }} />}
                />
              )}
            </div>
            {charts.map((chart) => (
              <CardContainer key={chart.key} title={<>{chart.title}</>}>
                {chart.data.length ? (
                  <CustomPieChart data={chart.data} fill={'#7B7D7D'} color={theme.text.secondary} />
                ) : (
                  <div style={{ height: 300, display: 'grid', placeItems: 'center', color: theme.text.tertiary }}>
                    {language['NO_DATA']}
                  </div>
                )}
              </CardContainer>
            ))}
          </div>
        </Container>
      )}
    </Layout>
  )
}

export {
  Promotions,
  CreatePromotion,
  UpdatePromotion,
  DetailPromotion,
} from './promotion'

export {
  Announcements,
  CreateAnnouncement,
  UpdateAnnouncement,
  DetailAnnouncement,
} from './announcement'

export { CustomerRM } from './customer'
export { CreateCustomer, UpdateCustomer, OfflineCustomer } from './customer/Profile'
export { CustomerTiers } from './customer/Tier'
