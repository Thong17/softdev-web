import Container from 'components/shared/Container'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MenuItem, Switch, Tooltip } from '@mui/material'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import TelegramIcon from '@mui/icons-material/Telegram'
import { telegramUrl } from 'utils/contactQr'
import { TierBadge } from 'components/shared/TierBadge'
import { PriceHistoryDialog } from 'components/shared/dialog/PriceHistoryDialog'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import { IconButton } from '@mui/material'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { DeleteButton, UpdateButton, ViewButton } from 'components/shared/table/ActionButton'
import { MenuDialog } from 'components/shared/MenuDialog'
import { MiniSelectField } from 'components/shared/form'
import { mapLink } from 'components/shared/form/MapPicker'
import { CustomButton } from 'styles'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import useOffline from 'hooks/useOffline'
import { currencyFormat, debounce, timeFormat } from 'utils'
import Breadcrumbs from '../components/Breadcrumbs'
import { PendingCustomers, SyncNowButton } from './PendingCustomers'

declare type ColumnHeader = 'customer' | 'phone' | 'tier' | 'group' | 'location' | 'lastPurchaseAt' | 'invoiceCount' | 'recentSpent' | 'totalSpent' | 'balance' | 'action'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'customer', label: 'Customer', minWidth: 120 },
  { id: 'phone', label: 'Phone', minWidth: 100 },
  { id: 'tier', label: 'Tier', minWidth: 80 },
  { id: 'group', label: 'Group', minWidth: 80 },
  { id: 'location', label: 'Location', minWidth: 70 },
  { id: 'lastPurchaseAt', label: 'Last Purchase', minWidth: 110 },
  { id: 'invoiceCount', label: 'Invoices', minWidth: 60 },
  { id: 'recentSpent', label: 'Spent (12 months)', minWidth: 95, noWrap: true },
  { id: 'totalSpent', label: 'Total Spent', minWidth: 85 },
  { id: 'balance', label: 'Balance', minWidth: 80 },
  { id: 'action', label: 'Action', minWidth: 120, align: 'right' },
]

// Customer relationship list: who bought when, highlighting customers who
// haven't bought in a while. "No purchase in N days" filters the list.
export const CustomerRM = () => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const { language } = useLanguage()
  const { notify, loadify } = useNotify()
  const [queryParams, setQueryParams] = useSearchParams()
  const { online, lastSyncedAt } = useOffline()
  const [customers, setCustomers] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [groups, setGroups] = useState<string[]>([])
  const [tiers, setTiers] = useState<any[]>([])
  const [historyCustomer, setHistoryCustomer] = useState<any>(null)
  // Months counted for tiers (Tiers page setting)
  const [months, setMonths] = useState(12)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [days, setDays] = useState(queryParams.get('inactiveDays') || '')
  const privilege = user?.privilege?.customer
  const inactiveDays = queryParams.get('inactiveDays')

  const fetchCustomers = () => {
    setLoading(true)
    Axios({ method: 'GET', url: '/organize/customer/rm', params: queryParams })
      .then((response) => {
        setCustomers(response?.data?.data || [])
        setCount(response?.data?.length || 0)
        if (response?.data?.months) setMonths(response.data.months)
      })
      // Offline the navbar cloud already shows it; customers added offline
      // are listed above
      .catch((err) => err?.response && notify(err.response.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  // Also loads again when the connection comes back and after offline
  // customers sync, so they show up in the list
  useEffect(() => {
    if (online) fetchCustomers()
    else setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, online, lastSyncedAt])

  useEffect(() => {
    Axios({ method: 'GET', url: '/organize/customer/options' })
      .then((response) => setGroups(response?.data?.data?.groups || []))
      .catch(() => {})
    Axios({ method: 'GET', url: '/organize/customer/tier' })
      .then((response) => setTiers(response?.data?.data?.tiers || []))
      .catch(() => {})
  }, [])

  const handleQuery = (data) => {
    const query = Object.fromEntries(queryParams)
    // Filters start again from the first page
    const next = { ...query, ...data, ...((data.limit || data.search !== undefined || data.inactiveDays !== undefined || data.group !== undefined || data.tier !== undefined || data.owing !== undefined) && { page: 0 }) }
    Object.keys(next).forEach((key) => (next[key] === '' || next[key] === undefined) && delete next[key])
    setQueryParams(next)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearch = useMemo(() => debounce((value) => handleQuery({ search: value }), 300), [queryParams])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDays = useMemo(() => debounce((value) => handleQuery({ inactiveDays: value }), 400), [queryParams])

  const handleChangeDays = (event) => {
    const value = event.target.value
    // Whole days only; empty clears the filter
    if (value !== '' && !/^\d+$/.test(value)) return
    setDays(value)
    updateDays(value)
  }

  const handleConfirmDelete = (id) => {
    const response = Axios({ method: 'DELETE', url: `/organize/customer/disable/${id}` })
    loadify(response)
    response.then(() => fetchCustomers())
    setDeleteDialog({ open: false, id: null })
  }

  // "Today", "Yesterday", "4 days ago" or "Never", with the date on hover.
  // Customers matching the "no purchase in N days" filter are highlighted.
  const lastPurchaseOf = (customer) => {
    const days = customer.days
    const chip = (label, color) => (
      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: theme.radius.primary, backgroundColor: `${color}22`, color, fontSize: 13, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    )
    if (days === null || days === undefined) return chip('Never', theme.color.error)
    const label = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`
    const overdue = inactiveDays !== null && days >= Number(inactiveDays)
    const color = days === 0 ? theme.color.success : overdue ? theme.color.warning || theme.color.error : theme.text.secondary
    return (
      <Tooltip title={timeFormat(customer.lastPurchaseAt, 'YYYY-MM-DD HH:mm')}>
        {chip(label, color)}
      </Tooltip>
    )
  }

  // Same bordered box as the "No purchase in" filter
  const filterBox = {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
    gap: 8,
    padding: '0 4px 0 8px',
    height: 33,
    boxSizing: 'border-box' as const,
    border: theme.border.quaternary,
    borderRadius: theme.radius.primary,
    color: theme.text.secondary,
    fontSize: 13,
    whiteSpace: 'nowrap' as const,
  }

  const rows = customers.map((customer) => {
    const link = mapLink(customer.location?.lat !== undefined ? customer.location : null)
    const edit = () => navigate(`/function/customer/update/${customer._id}`)
    const remove = () => setDeleteDialog({ open: true, id: customer._id })
    const showHistory = () => setHistoryCustomer({ _id: customer._id, name: customer.fullName || customer.displayName })
    // Chat link from the saved Telegram (null when it can't be read)
    const telegram = telegramUrl(customer.telegram)
    const openTelegram = () => telegram && window.open(telegram, '_blank', 'noopener,noreferrer')
    const action = device === 'mobile' ? (
      <MenuDialog label={<ViewButton />}>
        {telegram && <MenuItem component='div' onClick={openTelegram}>Open Telegram</MenuItem>}
        <MenuItem component='div' onClick={showHistory}>Price history</MenuItem>
        {privilege?.update && <MenuItem component='div' onClick={edit}>{language['UPDATE'] || 'Edit'}</MenuItem>}
        {privilege?.delete && <MenuItem component='div' onClick={remove}>Delete</MenuItem>}
      </MenuDialog>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {telegram && (
          <Tooltip title={`Open Telegram chat (${customer.telegram})`}>
            <IconButton
              size='small'
              component='a'
              href={telegram}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Open Telegram chat'
              // Same shape as the Edit button (UpdateButton), in Telegram blue
              style={{ backgroundColor: '#29A9EB22', borderRadius: theme.radius.primary, color: '#29A9EB', marginLeft: 5 }}
            >
              <TelegramIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Price history'>
          <IconButton
            size='small'
            onClick={showHistory}
            aria-label='Price history'
            // Same shape as the Edit button (UpdateButton)
            style={{ backgroundColor: `${theme.text.secondary}22`, borderRadius: theme.radius.primary, color: theme.text.secondary, marginLeft: 5 }}
          >
            <HistoryRoundedIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        {privilege?.update && <UpdateButton style={{ margin: 0 }} onClick={edit} />}
        {privilege?.delete && <DeleteButton onClick={remove} />}
      </div>
    )
    return {
      id: customer._id,
      customer: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{customer.fullName || customer.companyName || '--'}</span>
          {customer.type === 'BUSINESS' && customer.companyName && customer.fullName && (
            <span style={{ fontSize: 12, color: theme.text.tertiary }}>{customer.companyName}</span>
          )}
        </div>
      ),
      phone: customer.displayName || '--',
      tier: customer.tier ? (
        <Tooltip title={`Spent $${Number(customer.tierSpent || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} recently · ${customer.tier.discount || 0}% off${customer.tierLocked ? ' · locked by staff' : ''}`}>
          <span>
            <TierBadge tier={customer.tier}>
              {customer.tierLocked && <LockRoundedIcon style={{ fontSize: 13 }} />}
            </TierBadge>
          </span>
        </Tooltip>
      ) : '--',
      group: customer.group || '--',
      location: link ? (
        <Tooltip title='Open in maps'>
          <a href={link} target='_blank' rel='noreferrer' style={{ color: theme.color.info, display: 'inline-flex' }}>
            <PlaceRoundedIcon style={{ fontSize: 20 }} />
          </a>
        </Tooltip>
      ) : '--',
      lastPurchaseAt: lastPurchaseOf(customer),
      invoiceCount: customer.invoiceCount || 0,
      recentSpent: currencyFormat(customer.recentSpent || 0, 'USD'),
      totalSpent: currencyFormat(customer.totalSpent || 0, 'USD'),
      // Still owed on Pay Later sales
      balance: (customer.balance || 0) > 0.005 ? <b style={{ color: theme.color.warning }}>{currencyFormat(customer.balance, 'USD')}</b> : '--',
      action,
    }
  })

  return (
    <Container
      header={
        <DefaultHeader
          styled={theme}
          handleSearch={(event) => updateSearch(event.target.value)}
          breadcrumb={<Breadcrumbs page='customerRm' />}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginLeft: 10,
              padding: '0 8px',
              height: 33,
              boxSizing: 'border-box',
              border: theme.border.quaternary,
              borderRadius: theme.radius.primary,
              color: theme.text.secondary,
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            No purchase in
            <input
              type='text'
              inputMode='numeric'
              value={days}
              onChange={handleChangeDays}
              placeholder='--'
              style={{
                width: 42,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: theme.text.primary,
                textAlign: 'center',
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            />
            days
          </label>
          {/* Only customers with a Pay Later balance */}
          <label style={{ ...filterBox, gap: 2, cursor: 'pointer' }}>
            Owing
            <Switch
              size='small'
              checked={queryParams.get('owing') === 'true'}
              onChange={(event) => handleQuery({ owing: event.target.checked ? 'true' : '' })}
              inputProps={{ 'aria-label': 'Owing only' }}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: theme.color.info },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.color.info, opacity: 0.5 },
                '& .MuiSwitch-track': { backgroundColor: theme.text.tertiary },
              }}
            />
          </label>
          <div style={filterBox}>
            Tier
            <MiniSelectField
              name='tier'
              width={100}
              value={queryParams.get('tier') || 'all'}
              options={[{ label: 'All', value: 'all' }, ...tiers.map((tier) => ({ label: tier.name, value: tier._id }))]}
              onChange={(event) => handleQuery({ tier: event.target.value === 'all' ? '' : event.target.value })}
            />
          </div>
          <div style={filterBox}>
            Group
            {/* The select hides an empty value, so "All" is 'all' and maps to no filter */}
            <MiniSelectField
              name='group'
              width={110}
              value={queryParams.get('group') || 'all'}
              options={[{ label: 'All', value: 'all' }, ...groups.map((group) => ({ label: group, value: group }))]}
              onChange={(event) => handleQuery({ group: event.target.value === 'all' ? '' : event.target.value })}
            />
          </div>
          <CustomButton
            styled={theme}
            onClick={() => navigate('/function/customer/tier')}
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info, whiteSpace: 'nowrap' }}
          >
            {language['TIERS']}
          </CustomButton>
          <SyncNowButton style={{ marginLeft: 10 }} />
          {privilege?.create && (
            <CustomButton
              styled={theme}
              onClick={() => navigate('/function/customer/create')}
              style={{ marginLeft: 10, backgroundColor: `${theme.color.success}22`, color: theme.color.success }}
            >
              {language['CREATE']}
            </CustomButton>
          )}
        </DefaultHeader>
      }
    >
      <PriceHistoryDialog customer={historyCustomer} onClose={() => setHistoryCustomer(null)} />
      <DeleteDialog
        id={deleteDialog.id}
        isOpen={deleteDialog.open}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDeleteDialog({ open: false, id: null })}
      />
      <PendingCustomers />
      <StickyTable
        columns={columnData.map((column) => (column.id === 'recentSpent' ? { ...column, label: `Spent (${months} month${months === 1 ? '' : 's'})` } : column))}
        rows={rows}
        loading={loading}
        setQuery={handleQuery}
        count={count}
        limit={parseInt(queryParams.get('limit') || '10')}
        skip={parseInt(queryParams.get('page') || '0')}
      />
    </Container>
  )
}
