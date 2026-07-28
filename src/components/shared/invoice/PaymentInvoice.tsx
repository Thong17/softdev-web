import { useAppDispatch, useAppSelector } from 'app/hooks'
import useAuth from 'hooks/useAuth'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { InvoiceContainer } from '../container/InvoiceContainer'

export const PaymentInvoice = ({ payment }: any) => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { data } = useAppSelector(selectStore)
  const [store, setStore] = useState<any | null>(null)
  const [listTransactions, setListTransactions] = useState<any>([])
  const [info, setInfo] = useState<any | null>(null)

  useEffect(() => {
    if (!user?.activeStoreId) return
    dispatch(
      getStore({
        id: user.activeStoreId,
        fields: [
          'name',
          'logo',
          'contact',
          'address',
          'type',
          'other',
          'font',
          'tax',
        ],
      })
    )
  }, [dispatch, user?.activeStoreId])

  useEffect(() => {
    setStore(data)
  }, [data])

  useEffect(() => {
    const mappedTransactions = payment?.transactions
    setListTransactions(mappedTransactions)
  }, [payment?.transactions])

  useEffect(() => {
    setInfo(payment)
  }, [payment])

  return (
    <InvoiceContainer
      name={store?.name}
      address={store?.address}
      contact={store?.contact}
      logo={store?.logo || 'default.png'}
      tax={store?.tax}
      font={store?.font}
      footer={store?.other}
      hasThermalBorder={false}
      padding='0 0 20px 0'
      rows={listTransactions}
      subtotal={info?.subtotal}
      invoice={info?.invoice}
      discounts={info?.discounts}
      services={info?.services}
      total={info?.total}
      createdBy={info?.createdBy?.username}
      createdAt={info?.createdAt}
  />
  )
}
