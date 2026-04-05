import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { invoiceColumns } from 'constants/variables'
import useTheme from 'hooks/useTheme'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { CustomReceiptContainer } from 'styles'
import { currencyFormat } from 'utils'
import { FlexBetween } from '../container/FlexBetween'
import { PreDate } from '../container/InvoiceContainer'
import { InvoiceTable } from '../table/InvoiceTable'

export const PreBorder = ({ styled }) => {
  return (
    <div
      style={{
        margin: '10px 0',
        borderTop: styled.border.dashed,
        borderColor: '#333',
        width: '100%',
      }}
    ></div>
  )
}

export const PaymentReceipt = ({ width = '100%', payment, storeData = null }: any) => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { data, status } = useAppSelector(selectStore)
  const [store, setStore] = useState<any | null>(storeData)
  const [listTransactions, setListTransactions] = useState<any>([])
  const [info, setInfo] = useState<any | null>(null)

  useEffect(() => {
    if (status !== 'INIT' || storeData) return
    dispatch(
      getStore({
        id: 'store',
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
  }, [dispatch, storeData, status])

  useEffect(() => {
    setStore(data)
  }, [data])

  useEffect(() => {
    setStore(storeData)
  }, [storeData])

  useEffect(() => {
    const mappedTransactions = payment?.transactions?.map((transaction) => {
      return {
        description: transaction.description,
        price: currencyFormat(transaction.total?.value, transaction.total?.currency),
        qty: transaction.quantity,
        disc: (
          <span>
            {transaction.discount.isFixed && 'Only '}
            {currencyFormat(
              transaction.discount.value,
              transaction.discount.type
            )}
          </span>
        ),
        total: currencyFormat(
          transaction.total.value,
          transaction.total.currency
        ),
      }
    })
    setListTransactions(mappedTransactions)
    setInfo(payment)
  }, [payment])

  return (
    <Box
      sx={{
        overflowX: 'hidden',
        overflowY: 'visible',
        height: 'fit-content',
        position: 'relative',
        minWidth: width,
        boxSizing: 'border-box',
        padding: '35px 0',
        fontSize: 24,
        '& *': {
          color: '#000000 !important',
        },
      }}
    >
      <CustomReceiptContainer mode='invoice' styled={theme} font={store?.font}>
        <h3
          style={{
            fontSize: 32,
            textAlign: 'center',
            fontFamily: `${store?.font} !important`,
          }}
        >
          {store?.name}
        </h3>
        <p
          style={{
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {store?.contact}
        </p>
        {info?.reservation?.structures?.length > 0 && (
          <FlexBetween>
            <span>
              Room:{' '}
              {info?.reservation?.structures
                ?.map((item) => item.title)
                .join(', ')}
            </span>
          </FlexBetween>
        )}
        <FlexBetween>
          <span>Order: {info?.invoice}</span>
          <span>Cashier: {info?.createdBy?.username}</span>
        </FlexBetween>
        <FlexBetween>
          <PreDate date={info?.createdAt} />
        </FlexBetween>
        <div style={{ height: 10 }}></div>
        <InvoiceTable columns={invoiceColumns} rows={listTransactions} />
        <Box style={{ lineHeight: 0 }}>{'-'.repeat(300)}</Box>
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'end',
          }}
        >
          <div style={{ width: '50%', marginTop: 10 }}>
            <FlexBetween>
              <span>Subtotal:</span>
              <span style={{ lineHeight: 1 }}>
                {currencyFormat(info?.subtotal?.USD, 'USD')}
              </span>
            </FlexBetween>
            <FlexBetween>
              <span>Discount</span>
              <span style={{ lineHeight: 1 }}>
                {currencyFormat(parseFloat(info?.discounts?.[0]?.value), info?.discounts?.[0]?.type)}
              </span>
            </FlexBetween>
            <FlexBetween>
              <span>Tax</span>
              <span style={{ lineHeight: 1 }}>
                {currencyFormat(parseFloat(info?.services?.[0]?.value), info?.services?.[0]?.type)}
              </span>
            </FlexBetween>
            <FlexBetween>
              <span>Total</span>
              <span style={{ lineHeight: 1 }}>
                {currencyFormat(
                  parseFloat(info?.total?.value),
                  info?.total?.currency
                )}
              </span>
            </FlexBetween>
          </div>
        </div>
        {store?.address && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <p
              style={{
                textAlign: 'center',
                maxWidth: '80%',
              }}
            >
              {store?.address}
            </p>
          </div>
        )}
        <p
          style={{
            textAlign: 'center',
          }}
        >
          {store?.other}
        </p>
      </CustomReceiptContainer>
    </Box>
  )
}
