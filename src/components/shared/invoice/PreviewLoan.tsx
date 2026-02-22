import { Box } from '@mui/system'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useTheme from 'hooks/useTheme'
import { getStore, selectStore } from 'modules/organize/store/redux'
import React, { useEffect, useState } from 'react'
import { CustomPreviewContainer } from 'styles'
import { PreviewTable } from '../table/PreviewTable'
import { columnData } from '../table/LoanTable'
import { currencyFormat, durationFormat, timeFormat } from 'utils/index'
import { FlexBetween } from '../container/FlexBetween'
import useLanguage from 'hooks/useLanguage'

const mapData = (data) => {
  return {
    dueDate: timeFormat(data.dueDate, 'DD/MM/YYYY'),
    principalAmount: currencyFormat(
      data.principalAmount.value,
      data.principalAmount.currency, 2
    ),
    interestAmount: currencyFormat(
      data.interestAmount.value,
      data.interestAmount.currency, 2
    ),
    totalAmount: currencyFormat(
      data.totalAmount.value,
      data.totalAmount.currency, 2
    ),
    principalBalance: currencyFormat(
      data.principalBalance.value,
      data.principalBalance.currency, 2
    ),
  }
}

export const PreviewLoan = ({ width = '100%', loanPreview, loanInfo }: any) => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { data } = useAppSelector(selectStore)
  const [store, setStore] = useState<any | null>(null)
  const { language } = useLanguage()

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
        <Box sx={{ display: 'flex', gap: '30%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box
            className='loan'
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: '20%',
              boxSizing: 'border-box',
              '&::before': {
                content: `''`,
                display: 'block',
              },
            }}
          >
            <FlexBetween>
              <span style={{ marginRight: '5px' }}>
                {language['LOAN_DURATION']}:
              </span>
              <span style={{ fontWeight: 600 }}>
                {durationFormat(loanInfo?.duration?.value, loanInfo?.duration?.time)}
              </span>
            </FlexBetween>
            <FlexBetween>
              <span style={{ marginRight: '5px' }}>
                {language['LOAN_AMOUNT']} (USD):
              </span>
              <span style={{ fontWeight: 600 }}>{currencyFormat(loanInfo?.totalRemain?.USD, 'USD')}</span>
            </FlexBetween>
            <FlexBetween>
              <span style={{ marginRight: '5px' }}>
                {language['LOAN_AMOUNT']} (KHR):
              </span>
              <span style={{ fontWeight: 600 }}>{currencyFormat(loanInfo?.totalRemain?.KHR, 'KHR')}</span>
            </FlexBetween>
          </Box>
          <Box 
            className='loan'
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: '20%',
              boxSizing: 'border-box',
              '&::before': {
                content: `''`,
                display: 'block',
              },
            }}
          >
            <FlexBetween>
              <span style={{ marginRight: '5px' }}>{language['APPLY_RATE']}:</span>
              <span style={{ fontWeight: 600 }}>
                {currencyFormat(loanInfo?.interest?.value, loanInfo?.interest?.currency, 2)} /{' '}
                {durationFormat(1, 'month')}
              </span>
            </FlexBetween>
            <FlexBetween>
              <span style={{ marginRight: '5px' }}>
                {language['PREPAYMENT_PENALTY']}:
              </span>
              <span style={{ fontWeight: 600 }}>
                {currencyFormat(
                  loanInfo?.prepayment?.value,
                  loanInfo?.prepayment?.currency, 2
                )}{' '}
                /{' '}
                {durationFormat(
                  loanInfo?.prepayment?.duration?.value,
                  loanInfo?.prepayment?.duration?.time
                )}
              </span>
            </FlexBetween>
            <FlexBetween>
              <span style={{ marginRight: '5px' }}>
                {language['OVERDUE_PENALTY']}:
              </span>
              <span style={{ fontWeight: 600 }}>
                {currencyFormat(loanInfo?.overdue?.value, loanInfo?.overdue?.currency, 2)} /{' '}
                {durationFormat(
                  loanInfo?.overdue?.duration?.value,
                  loanInfo?.overdue?.duration?.time
                )}
              </span>
            </FlexBetween>
          </Box>
        </Box>
        
        <div style={{ height: 10 }}></div>
        <PreviewTable columns={columnData?.filter(item => !['status', 'action'].includes(item.id))} rows={loanPreview?.map(item => mapData(item))} />
      </CustomPreviewContainer>
    </Box>
  )
}
