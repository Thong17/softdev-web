import Container from 'components/shared/Container'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MenuItem, Tooltip } from '@mui/material'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { TierBadge } from 'components/shared/TierBadge'
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
import { currencyFormat, debounce, timeFormat } from 'utils'
import Breadcrumbs from '../components/Breadcrumbs'

declare type ColumnHeader = 'customer' | 'phone' | 'tier' | 'group' | 'location' | 'lastPurchaseAt' | 'invoiceCount' | 'recentSpent' | 'totalSpent' | 'action'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'customer', label: 'Customer', minWidth: 120 },
  { id: 'phone', label: 'Phone', minWidth: 100 },
  { id: 'tier', label: 'Tier', minWidth: 80 },
  { id: 'group', label: 'Group', minWidth: 80 },
  { id: 'location', label: 'Location', minWidth: 70 },
  { id: 'lastPurchaseAt', label: 'Last Purchase', minWidth: 110 },
  { id: 'invoiceCount', label: 'Invoices', minWidth: 60 },
  { id: 'recentSpent', label: 'Spent (12 months)', minWidth: 95 },
  { id: 'totalSpent', label: 'Total Spent', minWidth: 85 },
  { id: 'action', label: 'Action', minWidth: 90, align: 'right' },
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
  const [customers, setCustomers] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [groups, setGroups] = useState<string[]>([])
  const [tiers, setTiers] = useState<any[]>([])
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
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCustomers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

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
    const next = { ...query, ...data, ...((data.limit || data.search !== undefined || data.inactiveDays !== undefined || data.group !== undefined || data.tier !== undefined) && { page: 0 }) }
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
    const edit = () => navigate(`/function/customer-rm/update/${customer._id}`)
    const remove = () => setDeleteDialog({ open: true, id: customer._id })
    const action = device === 'mobile' ? (
      <MenuDialog label={<ViewButton />}>
        {privilege?.update && <MenuItem component='div' onClick={edit}>{language['UPDATE'] || 'Edit'}</MenuItem>}
        {privilege?.delete && <MenuItem component='div' onClick={remove}>Delete</MenuItem>}
      </MenuDialog>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
            onClick={() => navigate('/function/customer-rm/tier')}
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          >
            Tiers
          </CustomButton>
          {privilege?.create && (
            <CustomButton
              styled={theme}
              onClick={() => navigate('/function/customer-rm/create')}
              style={{ marginLeft: 10, backgroundColor: `${theme.color.success}22`, color: theme.color.success }}
            >
              {language['CREATE']}
            </CustomButton>
          )}
        </DefaultHeader>
      }
    >
      <DeleteDialog
        id={deleteDialog.id}
        isOpen={deleteDialog.open}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDeleteDialog({ open: false, id: null })}
      />
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
