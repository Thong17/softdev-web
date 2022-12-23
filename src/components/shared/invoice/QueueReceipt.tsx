import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useTheme from 'hooks/useTheme'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { CustomReceiptContainer } from 'styles'

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

export const QueueReceipt = ({ width = '100vw', info }: any) => {
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
        <h3
          style={{
            fontSize: 32,
            textAlign: 'center',
          }}
        >
          #Ticket
        </h3>
        <h5 style={{ fontSize: 28, textAlign: 'center', fontFamily: `${store?.font} !important` }}>{info?.ticket?.toString().padStart(2, '0')}</h5>
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
      </CustomReceiptContainer>
    </Box>
  )
}
