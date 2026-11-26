import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { getListPayment, selectListPayment } from 'modules/report/payment/redux'
import React, { useEffect, useRef, useState } from 'react'
import { Header } from './Header'
import { ExpandableTable } from 'components/shared/table/ExpandableTable'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import { SaleReportRowDetail } from 'modules/report/SaleReport'
import { currencyFormat } from 'utils/index'
import useAuth from 'hooks/useAuth'
import useStoreFeatures from 'hooks/useStoreFeatures'
import { columnData, createData } from './constant'
import { PaymentForm } from '../cashing/PaymentForm'
import GroupPaymentDialog from './GroupPaymentDialog'
import { CollectDialog } from './CollectDialog'
import { SelectTab } from 'components/shared/form/SelectTab'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { MergeButton } from 'components/shared/table/ActionButton'
import { IconButton, Tooltip } from '@mui/material'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { timeFormat } from 'utils'

declare type PayLaterColumn = 'invoice' | 'customer' | 'total' | 'paid' | 'balance' | 'dueDate' | 'createdAt' | 'action'

// Operation › Payment › Pay Later: sales sold now and still owing
const payLaterColumns: ITableColumn<PayLaterColumn>[] = [
    { id: 'invoice', label: 'INVOICE', minWidth: 110 },
    { id: 'customer', label: 'CUSTOMER', minWidth: 130 },
    { id: 'total', label: 'TOTAL', minWidth: 80 },
    { id: 'paid', label: 'PAID', minWidth: 80 },
    { id: 'balance', label: 'BALANCE', minWidth: 90 },
    { id: 'dueDate', label: 'DUE', minWidth: 90 },
    { id: 'createdAt', label: 'CREATED_AT', minWidth: 110 },
    { id: 'action', label: 'ACTION', minWidth: 130, align: 'right' },
]

export const mergePayments = (data, groupPayment) => {
    const paymentsData = data || []

    // Build a merged payment object compatible with InvoicePreview
    const base = {
        _id: null,
        invoice: groupPayment?.invoice,
        total: groupPayment?.total,
        subtotal: groupPayment?.subtotal,
        rate: groupPayment?.rate,
        discounts: [],
        vouchers: [],
        services: [],
        transactions: [],
        createdBy: groupPayment?.createdBy,
        returnCashes: [],
        receiveCashes: [],
    }

    const merged = {
        ...base,
        transactions: paymentsData.flatMap((p) => p.transactions || []),
        discounts: paymentsData.flatMap((p) => p.discounts || []),
        vouchers: paymentsData.flatMap((p) => p.vouchers || []),
        services: paymentsData.flatMap((p) => p.services || []),
    }

    return { paymentsData, merged }
}

const GroupPayment = () => {
    const dispatch = useAppDispatch()
    const [rowData, setRowData] = useState<any[]>([])
    const [queryParams, setQueryParams] = useSearchParams({ state: 'PENDING' })
    const [expandedRows, setExpandedRows] = useState<string[]>([])
    const [rowDetails, setRowDetails] = useState<Record<string, any[]>>({})
    const [detailLoading, setDetailLoading] = useState<Record<string, boolean>>({})
    const { data: payments, count, status } = useAppSelector(selectListPayment)
    const { theme } = useTheme()
    // Store › Features: no Table column for stores without tables
    const features = useStoreFeatures()
    const columns = features.tables ? columnData : columnData.filter((column) => column.id !== 'table')
    const { notify } = useNotify()
    const { language } = useLanguage()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [listPaymentSelected, setListPaymentSelected] = useState<string[]>([]);
    // Unpaid (never checked out) or Pay Later (sold, still owing)
    const isPayLaterView = queryParams.get('payLater') === 'owing'
    const [collectPayment, setCollectPayment] = useState<any>(null)
    // How many sales each tab holds: shown on the tabs, and used to open on a
    // tab that has something when the page is opened without choosing one
    const [tabCounts, setTabCounts] = useState<{ pending: number, later: number } | null>(null)
    // A tab named in the link (or clicked) is kept; otherwise one is picked once
    const [linkNamesTab] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.has('payLater') || params.has('state')
    })
    const tabChosen = useRef(linkNamesTab)

    const [paymentDialog, setPaymentDialog] = useState<any>({
        open: false,
        payment: null,
    })

    const [groupPaymentDialog, setGroupPaymentDialog] = useState<any>({
        open: false,
        payments: [],
    })

    const toggleRowExpansion = async (id: string) => {
        if (expandedRows.includes(id)) {
          setExpandedRows((prev) => prev.filter((rowId) => rowId !== id))
          return
        }
    
        setExpandedRows((prev) => [...prev, id])
        if (rowDetails[id]) return
    
        setDetailLoading((prev) => ({ ...prev, [id]: true }))
        try {
          const response = await Axios({
            url: `/sale/payment/detail/${id}`,
            method: 'GET',
          })
          const detailData = response?.data?.data
          setRowDetails((prev) => ({
            ...prev,
            [id]: detailData?.transactions || [],
          }))
        } catch (err: any) {
          notify(err?.response?.data?.msg, 'error')
        } finally {
          setDetailLoading((prev) => ({ ...prev, [id]: false }))
        }
    }

    const handleQuery = (data) => {
        let { limit, search } = data

        let query = {}
        const _limit = queryParams.get('limit')
        const _page = queryParams.get('page')
        const _search = queryParams.get('search')
        const _filter = queryParams.get('filter')
        const _sort = queryParams.get('sort')
        const _state = queryParams.get('payLater') ? null : (queryParams.get('state') ?? 'PENDING')
        const _payLater = queryParams.get('payLater')

        if (_limit) query = { limit: _limit, ...query }
        if (_page) query = { page: _page, ...query }
        if (_search) query = { search: _search, ...query }
        if (_filter) query = { filter: _filter, ...query }
        if (_sort) query = { sort: _sort, ...query }
        if (_state) query = { state: _state, ...query }
        if (_payLater) query = { payLater: _payLater, ...query }

        if (limit || search) return setQueryParams({ ...query, ...data, page: 0 })
        setQueryParams({ ...query, ...data })
    }

    useEffect(() => {
        dispatch(getListPayment({ query: queryParams }))
    }, [dispatch, queryParams])

    const handleView = (id, type) => {
        if (type === 'detail') return navigate(`/sale/payment/${id}`)
        Axios({
            url: `/sale/payment/detail/${id}`,
            method: 'GET',
        })
            .then((data) => {
                setPaymentDialog({ payment: data?.data?.data, open: true })
            })
            .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }

    const handleMerge = (id) => {
        setListPaymentSelected(prev => {
            const isExist = prev.includes(id)
            return isExist
                ? prev.filter(item => item !== id)
                : [...prev, id]
        })
    }

    useEffect(() => {
        const listTransactions = payments.map((payment: any) => {
            return createData(
                payment._id,
                payment.invoice,
                payment.paymentMethod?.toUpperCase() ?? '--',
                currencyFormat(payment.subtotal.BOTH, 'USD'),
                currencyFormat(
                    payment.vouchers[0]?.value,
                    payment.vouchers[0]?.type,
                ),
                currencyFormat(
                    payment.discounts[0]?.value,
                    payment.discounts[0]?.type,
                ),
                currencyFormat(
                    payment.services[0]?.value,
                    payment.services[0]?.type,
                ),
                currencyFormat(payment.total.value, payment.total.currency),
                payment.state,
                payment.table || '--',
                payment.createdAt,
                payment.createdBy?.username,
                handleView,
                theme,
                user?.privilege,
                handleMerge,
                listPaymentSelected
            )
            })
        setRowData(listTransactions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [payments, user, theme, notify, listPaymentSelected])

    const handleOpenGroupPayment = () => {
        if (listPaymentSelected.length < 2) return notify('Group payment requires at least 2 selected payments', 'warning')
        Axios({
            url: '/sale/payment/group-payment',
            method: 'POST',
            body: {
                paymentIds: listPaymentSelected,
            },
        })
            .then((response) => {
                const { paymentsData, merged } = mergePayments(response?.data?.data, response?.data?.group)
                setGroupPaymentDialog({ payments: paymentsData, payment: merged, open: true })
            })
            .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }

    const handleRemovePayment = (id) => {
        const remainingSelected = groupPaymentDialog.payments.filter(payment => payment._id !== id)
        groupPaymentDialog.payments = remainingSelected

        if (remainingSelected.length < 2) {
            setGroupPaymentDialog({ payments: [], open: false })
            setListPaymentSelected(prev => prev.filter(item => item !== id))
            return notify('Group payment requires at least 2 selected payments', 'warning')
        }

        Axios({
            url: '/sale/payment/group-payment',
            method: 'POST',
            body: {
                paymentIds: remainingSelected,
            },
        })
            .then((response) => {
                setListPaymentSelected(prev => prev.filter(item => item !== id))
                const { paymentsData, merged } = mergePayments(response?.data?.data, response?.data?.group)
                setGroupPaymentDialog(prev => ({ ...prev, payments: paymentsData, payment: merged }))
            })
            .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }

    const switchView = (view) => {
        tabChosen.current = true
        setListPaymentSelected([])
        setExpandedRows([])
        setQueryParams(view === 'later' ? { payLater: 'owing' } : { state: 'PENDING' })
    }

    // Each time the list loads (page open, checkout, collect...), refresh both
    // tab counts. The first time, if no tab was chosen and Unpaid is empty
    // while Pay Later has sales, open Pay Later.
    useEffect(() => {
        if (status !== 'SUCCESS') return
        let cancelled = false
        Promise.all([
            Axios({ method: 'GET', url: '/sale/payment', params: new URLSearchParams({ state: 'PENDING', limit: '1' }) }),
            Axios({ method: 'GET', url: '/sale/payment', params: new URLSearchParams({ payLater: 'owing', limit: '1' }) }),
        ])
            .then(([pending, later]) => {
                if (cancelled) return
                const counts = { pending: pending?.data?.length || 0, later: later?.data?.length || 0 }
                setTabCounts(counts)
                if (tabChosen.current) return
                tabChosen.current = true
                if (!isPayLaterView && counts.pending === 0 && counts.later > 0) switchView('later')
            })
            .catch(() => {})
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, payments])

    // A tab name with its count as a small badge (none when empty)
    const tabLabel = (label: string, count: number | undefined, color: string) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {label}
            {!!count && (
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 20,
                        height: 20,
                        padding: '0 5px',
                        boxSizing: 'border-box',
                        borderRadius: 10,
                        backgroundColor: `${color}22`,
                        color,
                        fontSize: 11,
                        lineHeight: 1,
                    }}
                >
                    {count}
                </span>
            )}
        </span>
    )

    const payLaterRows = isPayLaterView ? payments.map((payment: any) => {
        const due = payment.payLater?.dueDate
        const overdue = due && new Date(due) < new Date()
        return {
            id: payment._id,
            invoice: payment.invoice,
            customer: payment.customer?.fullName || payment.customer?.companyName || payment.customer?.displayName || '--',
            total: currencyFormat(payment.total?.value, payment.total?.currency),
            paid: currencyFormat(payment.paidTotal || 0, 'USD'),
            balance: <b>{currencyFormat(payment.balance?.USD || 0, 'USD')}</b>,
            dueDate: due ? <span style={{ color: overdue ? theme.color.error : undefined, whiteSpace: 'nowrap' }}>{timeFormat(due, 'YYYY-MM-DD')}{overdue ? ` · ${language['OVERDUE'] || 'Overdue'}` : ''}</span> : '--',
            createdAt: timeFormat(payment.createdAt, 'YYYY-MM-DD HH:mm'),
            action: (
                <div style={{ display: 'flex', gap: 5, justifyContent: 'end', alignItems: 'center' }}>
                    {user?.privilege?.payment?.merge && (
                        <MergeButton isOn={listPaymentSelected.includes(payment._id)} onClick={(event) => { event.stopPropagation(); handleMerge(payment._id) }} />
                    )}
                    {user?.privilege?.payment?.update && (
                        <Tooltip title={language['COLLECT_PAYMENT'] || 'Collect payment'}>
                            <IconButton size='small' onClick={() => setCollectPayment(payment)} style={{ backgroundColor: `${theme.color.success}22`, borderRadius: theme.radius.primary, color: theme.color.success }}>
                                <PaymentsRoundedIcon style={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title={language['DETAIL'] || 'Detail'}>
                        <IconButton size='small' onClick={() => navigate(`/sale/payment/${payment._id}`)} style={{ backgroundColor: `${theme.color.info}22`, borderRadius: theme.radius.primary, color: theme.color.info }}>
                            <VisibilityRoundedIcon style={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        }
    }) : []

    return (
        <Container
            header={
                <Header
                    privilege={user?.privilege}
                    styled={theme}
                    listPaymentSelected={listPaymentSelected}
                    onOpenGroupPayment={handleOpenGroupPayment}
                />
            }
        >
            <GroupPaymentDialog
                source='report'
                dialog={groupPaymentDialog}
                setDialog={setGroupPaymentDialog}
                handleRemovePayment={handleRemovePayment}
                onCheckout={() => {
                    setListPaymentSelected([])
                    dispatch(getListPayment({ query: queryParams }))
                }}
            />
            <PaymentForm
                source='report'
                dialog={paymentDialog}
                setDialog={setPaymentDialog}
                onCheckout={() => {
                    dispatch(getListPayment({ query: queryParams }))
                }}
            />
            <CollectDialog
                payment={collectPayment}
                onClose={() => setCollectPayment(null)}
                onCollected={() => dispatch(getListPayment({ query: queryParams }))}
            />
            <div style={{ padding: '10px 0' }}>
                <SelectTab
                    selected={isPayLaterView ? 'later' : 'pending'}
                    options={[
                        { label: tabLabel(language['UNPAID'] || 'Unpaid', tabCounts?.pending, theme.color.info), value: 'pending' },
                        { label: tabLabel(language['PAY_LATER'] || 'Pay Later', tabCounts?.later, theme.color.warning), value: 'later' },
                    ]}
                    onChange={switchView}
                />
            </div>
            {isPayLaterView ? (
                <StickyTable
                    columns={payLaterColumns}
                    rows={payLaterRows}
                    setQuery={handleQuery}
                    count={count}
                    limit={Number.parseInt(queryParams.get('limit') || '10')}
                    skip={status === 'SUCCESS' ? Number.parseInt(queryParams.get('page') || '0') : 0}
                />
            ) : (
            <ExpandableTable
                columns={columns}
                rows={rowData}
                setQuery={handleQuery}
                handleClick={toggleRowExpansion}
                expandedRowIds={expandedRows}
                renderRowDetail={(row) => (
                    <SaleReportRowDetail
                        row={row}
                        rowDetails={rowDetails}
                        detailLoading={detailLoading}
                        theme={theme}
                        language={language}
                    />
                )}
                count={count}
                limit={Number.parseInt(queryParams.get('limit') || '10')}
                skip={
                    status === 'SUCCESS'
                        ? Number.parseInt(queryParams.get('page') || '0')
                        : 0
                }
            />
            )}
        </Container>
    )
}

export default GroupPayment