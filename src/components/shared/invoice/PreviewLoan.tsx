import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useTheme from 'hooks/useTheme'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { CustomPreviewContainer } from 'styles'
import { PreviewTable } from '../table/PreviewTable'
import { columnData } from '../table/LoanTable'
import { currencyFormat, timeFormat } from 'utils/index'

const mapData = (data, theme, allowPayment, onPayment, onPrint) => {
  return {
    dueDate: timeFormat(data.dueDate, 'YYYY/MM/DD'),
    principalAmount: currencyFormat(
      data.principalAmount.value,
      data.principalAmount.currency
    ),
    interestAmount: currencyFormat(
      data.interestAmount.value,
      data.interestAmount.currency
    ),
    totalAmount: currencyFormat(
      data.totalAmount.value,
      data.totalAmount.currency
    ),
    principalBalance: currencyFormat(
      data.principalBalance.value,
      data.principalBalance.currency
    ),
  }
}

export const PreviewLoan = ({ width = '100vw', loanPreview }: any) => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { data } = useAppSelector(selectStore)
  const [store, setStore] = useState<any | null>(null)

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
        '& *': {
          color: '#000000 !important',
        },
      }}
    >
      <CustomPreviewContainer mode='invoice' styled={theme} font={store?.font}>
        <Box sx={{ display: 'flex', gap: '5px' }}>
          <img src={store.logo} alt={store.name} />
          <h3
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontFamily: `${store?.font} !important`,
            }}
          >
            {store?.name}
          </h3>
        </Box>
        <h3
          style={{
            fontSize: 18,
            textAlign: 'center',
            fontFamily: `${store?.font} !important`,
          }}
        >
          {store?.name}
        </h3>
        {store?.address && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <p
              style={{
                textAlign: 'center',
                marginBottom: 10,
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
            marginBottom: 10,
          }}
        >
          {store?.contact}
        </p>
        <div style={{ height: 10 }}></div>
        <PreviewTable columns={columnData?.filter(item => !['status', 'action'].includes(item.id))} rows={loanPreview?.map(item => mapData(item, theme, false, null, null))} />
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
      </CustomPreviewContainer>
    </Box>
  )
}
