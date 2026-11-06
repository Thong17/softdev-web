import Container from 'components/shared/Container'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MenuItem } from '@mui/material'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { DeleteButton, UpdateButton, ViewButton } from 'components/shared/table/ActionButton'
import { MenuDialog } from 'components/shared/MenuDialog'
import { CustomButton } from 'styles'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getStore, selectStore } from 'modules/organize/store/redux'
import { currencyFormat, debounce, timeFormat } from 'utils'
import SaleBreadcrumbs from '../components/Breadcrumbs'
import { exportQuotationExcel } from './api'
import { QuotationPdfExporter } from './QuotationDocument'

declare type ColumnHeader = 'invoice' | 'customer' | 'items' | 'total' | 'createdBy' | 'createdAt' | 'action'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'invoice', label: 'No', minWidth: 140 },
  { id: 'customer', label: 'Customer', minWidth: 150 },
  { id: 'items', label: 'Items', minWidth: 70 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'createdBy', label: 'Created By', minWidth: 100 },
  { id: 'createdAt', label: 'Created At', minWidth: 140 },
  { id: 'action', label: 'Action', minWidth: 170, align: 'right' },
]

export const QuotationList = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { user } = useAuth()
  const { lang } = useLanguage()
  const { notify, loadify } = useNotify()
  const { data: store } = useAppSelector(selectStore)
  const [queryParams, setQueryParams] = useSearchParams()
  const [quotations, setQuotations] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState({ open: false, id: null })
  const [pdfQuotation, setPdfQuotation] = useState<any>(null)
  const privilege = user?.privilege?.quotation

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

  useEffect(() => {
    dispatch(getStore({ id: 'store', fields: ['name', 'logo', 'contact', 'address', 'other', 'font'] }))
  }, [dispatch])

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

  const handleExcel = (id) => {
    exportQuotationExcel(id, lang).catch((err) => notify(err?.response?.data?.msg, 'error'))
  }

  const rows = quotations.map((quotation) => {
    const open = () => navigate(`/sale/quotation/${quotation._id}`)
    const action = device === 'mobile' ? (
      <MenuDialog label={<ViewButton />}>
        <MenuItem component='div' onClick={open}>Open</MenuItem>
        <MenuItem component='div' onClick={() => setPdfQuotation(quotation)}>PDF</MenuItem>
        <MenuItem component='div' onClick={() => handleExcel(quotation._id)}>Excel</MenuItem>
        {privilege?.delete && <MenuItem component='div' onClick={() => setDialog({ open: true, id: quotation._id })}>Delete</MenuItem>}
      </MenuDialog>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {privilege?.update && <UpdateButton style={{ margin: 0 }} onClick={open} />}
        <CustomButton
          styled={theme}
          onClick={() => setPdfQuotation(quotation)}
          style={{ marginLeft: 5, minWidth: 0, padding: '0 7px', height: 30, color: theme.color.error, backgroundColor: `${theme.color.error}22` }}
        >
          <PictureAsPdfRoundedIcon style={{ fontSize: 18 }} />
        </CustomButton>
        <CustomButton
          styled={theme}
          onClick={() => handleExcel(quotation._id)}
          style={{ marginLeft: 5, minWidth: 0, padding: '0 7px', height: 30, color: theme.color.info, backgroundColor: `${theme.color.info}22` }}
        >
          <TableViewRoundedIcon style={{ fontSize: 18 }} />
        </CustomButton>
        {privilege?.delete && <DeleteButton onClick={() => setDialog({ open: true, id: quotation._id })} />}
      </div>
    )

    return {
      id: quotation._id,
      invoice: quotation.invoice,
      customer: quotation.customer?.displayName || quotation.customer?.fullName || '...',
      items: quotation.items?.length || 0,
      total: currencyFormat(quotation.total?.value, quotation.total?.currency),
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
          createUrl={privilege?.create ? '/sale/quotation' : undefined}
        />
      }
    >
      <QuotationPdfExporter
        quotation={pdfQuotation}
        store={store}
        onDone={(err) => {
          if (err) notify(err?.message || 'Failed to export PDF', 'error')
          setPdfQuotation(null)
        }}
      />
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
