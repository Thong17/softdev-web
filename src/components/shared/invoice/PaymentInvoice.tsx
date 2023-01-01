import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { invoiceColumns } from 'constants/variables'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { CustomInvoiceContainer } from 'styles'
import { currencyFormat } from 'utils'
import { FlexBetween } from '../container/FlexBetween'
import { PreDate, PreTime } from '../container/InvoiceContainer'
import { InvoiceTable } from '../table/InvoiceTable'

export const PreBorder = ({ styled }) => {
  return (
    <div
      style={{
        margin: '10px 0',
        borderTop: styled.border.dashed,
        borderColor: '#777',
        width: '100%',
      }}
    ></div>
  )
}

export const PaymentInvoice = ({ payment }: any) => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { device } = useWeb()
  const { data } = useAppSelector(selectStore)
  const [store, setStore] = useState<any | null>(null)
  const [listTransactions, setListTransactions] = useState<any>([])
  const [info, setInfo] = useState<any | null>(null)

  useEffect(() => {
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
  }, [dispatch])

  useEffect(() => {
    setStore(data)
  }, [data])

  useEffect(() => {
    const mappedTransactions = payment?.transactions?.map((transaction) => {
      return {
        description: transaction.description,
        price: currencyFormat(transaction.price, transaction.currency),
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
  }, [payment?.transactions])

  useEffect(() => {
    setInfo(payment)
  }, [payment])

  return (
    <Box
      sx={{
        overflowX: 'hidden',
        overflowY: 'visible',
        height: 'fit-content',
        position: 'relative',
        minWidth: '100%',
        boxSizing: 'border-box',
        padding: '35px 0',
        '& *': {
          color: '#000000 !important',
        },
      }}
    >
      <CustomInvoiceContainer mode='invoice' styled={theme} font={store?.font}>
        <h3
          style={{
            fontSize: theme.responsive[device]?.text.h1,
            textAlign: 'center',
          }}
        >
          {store?.name}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            style={{
              fontSize: theme.responsive[device]?.text.quaternary,
              textAlign: 'center',
              marginBottom: 10,
              maxWidth: '80%',
            }}
          >
            {store?.address}
          </p>
        </div>
        <p
          style={{
            fontSize: theme.responsive[device]?.text.quaternary,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {store?.contact}
        </p>
        <FlexBetween>
          <PreDate date={info?.createdAt} />
          <PreTime date={info?.createdAt} />
        </FlexBetween>
        <FlexBetween>
          <span>Invoice: {info?.invoice}</span>
          <span>Cashier: {info?.createdBy?.username}</span>
        </FlexBetween>
        <div style={{ height: 10 }}></div>
        <InvoiceTable columns={invoiceColumns} rows={listTransactions} />
        <PreBorder styled={theme} />
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'space-between',
          }}
        >
          <span>Subtotal</span>
          <div style={{ width: '50%' }}>
            <FlexBetween>
              <span>USD:</span>
              <span style={{ lineHeight: 1 }}>{currencyFormat(info?.subtotal?.USD, 'USD')}</span>
            </FlexBetween>
            <FlexBetween>
              <span>KHR:</span>
              <span style={{ lineHeight: 1 }}>{currencyFormat(info?.subtotal?.KHR, 'KHR')}</span>
            </FlexBetween>
            {info?.discounts?.map((prop, key) => {
              if (parseFloat(prop.value) <= 0) return <span key={key} style={{ display: 'none' }}></span>
              return (
                <FlexBetween key={key}>
                  <span>{prop.title}</span>
                  <span style={{ lineHeight: 1 }}>
                    -{currencyFormat(parseFloat(prop.value), prop.type)}
                  </span>
                </FlexBetween>
              )
            })}
            {info?.services?.map((prop, key) => {
              if (parseFloat(prop.value) <= 0) return <span key={key} style={{ display: 'none' }}></span>
              return (
                <FlexBetween key={key}>
                  <span>{prop.title}</span>
                  <span style={{ lineHeight: 1 }}>
                    {currencyFormat(parseFloat(prop.value), prop.type)}
                  </span>
                </FlexBetween>
              )
            })}
            {info?.vouchers?.map((prop, key) => {
              if (parseFloat(prop.value) <= 0) return <span key={key} style={{ display: 'none' }}></span>
              return (
                <FlexBetween key={key}>
                  <span>{prop.title}</span>
                  <span style={{ lineHeight: 1 }}>
                    -{currencyFormat(parseFloat(prop.value), prop.type)}
                  </span>
                </FlexBetween>
              )
            })}
            <PreBorder styled={theme} />
            <FlexBetween>
              <span>Total</span>
              <span style={{ lineHeight: 1 }}>{currencyFormat(parseFloat(info?.total?.value), info?.total?.currency)}</span>
            </FlexBetween>
            <PreBorder styled={theme} />
            <FlexBetween>
              <span>Receive</span>
              <span style={{ lineHeight: 1 }}>{currencyFormat(parseFloat(info?.receiveTotal?.total), 'USD')}</span>
            </FlexBetween>
            <FlexBetween>
              <span>{parseFloat(info?.remainTotal?.USD) < 0 ? 'Return' : 'Remain'}</span>
              <span style={{ lineHeight: 1 }}>{currencyFormat(parseFloat(info?.remainTotal?.USD), 'USD')}</span>
            </FlexBetween>
          </div>
        </div>
        <p
          style={{
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          {store?.footer}
        </p>
        <p
          style={{
            textAlign: 'center',
          }}
        >
          Thank you for coming
        </p>
      </CustomInvoiceContainer>
    </Box>
  )
}
