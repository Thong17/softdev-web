import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useTheme from 'hooks/useTheme'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { CustomPreviewContainer } from 'styles'
import { InvoiceTable } from '../table/InvoiceTable'
import { columnData, mapData } from '../table/LoanTable'

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
        <InvoiceTable columns={columnData?.filter(item => !['status', 'action'].includes(item.id))} rows={loanPreview?.map(item => mapData(item, theme, false, null, null))} />
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
