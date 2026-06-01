import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { getListPayment, selectListPayment } from 'modules/report/payment/redux'
import React, { useEffect, useState } from 'react'
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
import { columnData, createData } from './constant'
import { PaymentForm } from '../cashing/PaymentForm'
import GroupPaymentDialog from './GroupPaymentDialog'

const GroupPayment = () => {
    const dispatch = useAppDispatch()
    const [rowData, setRowData] = useState<any[]>([])
    const [queryParams, setQueryParams] = useSearchParams({ state: 'PENDING' })
    const [expandedRows, setExpandedRows] = useState<string[]>([])
    const [rowDetails, setRowDetails] = useState<Record<string, any[]>>({})
    const [detailLoading, setDetailLoading] = useState<Record<string, boolean>>({})
    const { data: payments, count, status } = useAppSelector(selectListPayment)
    const { theme } = useTheme()
    const { notify } = useNotify()
    const { language } = useLanguage()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [listPaymentSelected, setListPaymentSelected] = useState<string[]>([]);

    const [paymentDialog, setPaymentDialog] = useState<any>({
        open: false,
        payment: null,
    })

    const [groupPaymentDialog, setGroupPaymentDialog] = useState<any>({
        open: false,
        payment: [],
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
        const _state = queryParams.get('state') ?? 'PENDING'

        if (_limit) query = { limit: _limit, ...query }
        if (_page) query = { page: _page, ...query }
        if (_search) query = { search: _search, ...query }
        if (_filter) query = { filter: _filter, ...query }
        if (_sort) query = { sort: _sort, ...query }
        if (_state) query = { state: _state, ...query }

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
            .catch((err) => notify(err?.response?.data?.msg))
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

    return (
        <Container
            header={
                <Header privilege={user?.privilege} styled={theme} listPaymentSelected={listPaymentSelected} onOpenGroupPayment={() => setGroupPaymentDialog({ open: true, payments: listPaymentSelected })} />
            }
        >   
            <GroupPaymentDialog dialog={groupPaymentDialog} setDialog={setGroupPaymentDialog} />
            <PaymentForm
                source="report"
                dialog={paymentDialog}
                setDialog={setPaymentDialog}
                onCheckout={() => {
                //   setPaymentDialog({ open: false, payment: null })
                    dispatch(getListPayment({ query: queryParams }))
                }}
            />
            <ExpandableTable
                columns={columnData}
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
        </Container>
    )
}

export default GroupPayment