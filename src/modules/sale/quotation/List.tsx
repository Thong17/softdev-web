import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MenuItem, Tooltip } from '@mui/material'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { DeleteButton, DetailButton, UpdateButton, ViewButton } from 'components/shared/table/ActionButton'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import useAlert from 'hooks/useAlert'
import { MenuDialog } from 'components/shared/MenuDialog'
import { CustomButton } from 'styles'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { currencyFormat, debounce, timeFormat } from 'utils'
import SaleBreadcrumbs from '../components/Breadcrumbs'
import { convertQuotation, quotationStatus } from './api'
import { StatusChip } from './StatusChip'

declare type ColumnHeader = 'invoice' | 'customer' | 'items' | 'total' | 'status' | 'expireAt' | 'createdBy' | 'createdAt' | 'action'

// Sized to their content so the table fits without scrolling sideways
const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'invoice', label: 'No', minWidth: 110 },
  { id: 'customer', label: 'Customer', minWidth: 100 },
  { id: 'items', label: 'Items', minWidth: 45 },
  { id: 'total', label: 'Total', minWidth: 70 },
  { id: 'status', label: 'Status', minWidth: 90 },
  { id: 'expireAt', label: 'Valid Until', minWidth: 85 },
  { id: 'createdBy', label: 'Created By', minWidth: 80 },
  { id: 'createdAt', label: 'Created At', minWidth: 115 },
  { id: 'action', label: 'Action', minWidth: 120, align: 'right' },
]

export const QuotationList = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const { notify, loadify } = useNotify()
  const [queryParams, setQueryParams] = useSearchParams()
  const [quotations, setQuotations] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const privilege = user?.privilege?.quotation
  // Sending to cashing creates cart items, so it also needs the cashing privilege
  const canSendToCash = !!privilege?.detail && !!user?.privilege?.transaction?.create
  const confirm = useAlert()

  const handleToCash = (quotation) => {
    confirm({
      title: 'Send to cashing?',
      description: 'The items will be added to the cashing cart at the quoted prices and taken from stock. The quotation locks once the sale is paid.',
      variant: 'info',
    })
      .then(() => {
        const response = convertQuotation(quotation._id)
        loadify(response)
        response.then((result) => navigate('/sale/cashing', { state: { fromQuotation: result } }))
      })
      .catch(() => {})
  }

  const fetchQuotations = () => {
    setLoading(true)
    Axios({ method: 'GET', url: '/sale/quotation', params: queryParams })
      .then((response) => {
        setQuotations(response?.data?.data || [])
        setCount(response?.data?.length || 0)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchQuotations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams])

  const handleQuery = (data) => {
    const query = Object.fromEntries(queryParams)
    if (data.limit || data.search !== undefined) return setQueryParams({ ...query, ...data, page: 0 })
    setQueryParams({ ...query, ...data })
  }

  const updateSearch = debounce((value) => handleQuery({ search: value }), 300)

  const handleConfirmDelete = (id) => {
    const response = Axios({ method: 'DELETE', url: `/sale/quotation/delete/${id}` })
    loadify(response)
    response.then(() => fetchQuotations())
    setDialog({ open: false, id: null })
  }

  const rows = quotations.map((quotation) => {
    const open = () => navigate(`/sale/quotation/${quotation._id}`)
    // Converted quotations are locked: they open read-only and can't be deleted
    const converted = quotation.status === 'CONVERTED'
    const canDelete = privilege?.delete && !converted
    const toCash = canSendToCash && quotationStatus(quotation) === 'Draft'
    const action = device === 'mobile' ? (
      <MenuDialog label={<ViewButton />}>
        <MenuItem component='div' onClick={open}>{converted ? 'View' : 'Open'}</MenuItem>
        {toCash && <MenuItem component='div' onClick={() => handleToCash(quotation)}>To Cash</MenuItem>}
        {canDelete && <MenuItem component='div' onClick={() => setDialog({ open: true, id: quotation._id })}>Delete</MenuItem>}
      </MenuDialog>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {privilege?.update && (converted
          ? (
            <DetailButton
              onClick={open}
              style={{ margin: 0, borderRadius: theme.radius.primary, color: theme.text.secondary, backgroundColor: `${theme.text.secondary}22` }}
            />
          )
          : <UpdateButton style={{ margin: 0 }} onClick={open} />)}
        {toCash && (
          <Tooltip title='To Cash'>
            <CustomButton
              styled={theme}
              onClick={() => handleToCash(quotation)}
              style={{ marginLeft: 5, minWidth: 0, padding: '0 7px', height: 30, color: theme.color.success, backgroundColor: `${theme.color.success}22` }}
            >
              <PointOfSaleRoundedIcon style={{ fontSize: 18 }} />
            </CustomButton>
          </Tooltip>
        )}
        {canDelete && <DeleteButton onClick={() => setDialog({ open: true, id: quotation._id })} />}
      </div>
    )

    return {
      id: quotation._id,
      invoice: quotation.invoice,
      customer: quotation.customer?.displayName || quotation.customer?.fullName || '...',
      items: quotation.items?.length || 0,
      total: currencyFormat(quotation.total?.value, quotation.total?.currency),
      status: <StatusChip quotation={quotation} />,
      expireAt: quotation.expireAt ? timeFormat(quotation.expireAt, 'YYYY-MM-DD') : '...',
      createdBy: quotation.createdBy?.username || '...',
      createdAt: timeFormat(quotation.createdAt, 'YYYY-MM-DD HH:mm'),
      action,
    }
  })

  return (
    <Container
      header={
        <DefaultHeader
          styled={theme}
          navigate={navigate}
          handleSearch={(event) => updateSearch(event.target.value)}
          breadcrumb={<SaleBreadcrumbs page='quotationList' />}
          createUrl={privilege?.create ? '/sale/quotation/create' : undefined}
        />
      }
    >
      <DeleteDialog
        id={dialog.id}
        isOpen={dialog.open}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDialog({ open: false, id: null })}
      />
      <StickyTable
        columns={columnData}
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
