import { Box } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { currencyFormat, durationFormat } from 'utils/index'
import { CircleIcon } from '../table/CustomIcon'
import { TextEllipsis } from '../TextEllipsis'
import { FlexBetween } from './FlexBetween'

const LoanDetail = ({ data }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  return (
    <Box
      sx={{
        '& .customer, & .loan': {
          backgroundColor: `${theme.background.secondary}cc`,
          borderRadius: theme.radius.ternary,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        className='customer'
        sx={{
          position: 'relative',
          padding: '10px',
          display: 'flex',
          '&::before': {
            content: `''`,
            borderBottom: theme.border.dashed,
            position: 'absolute',
            bottom: -1,
            left: 10,
            display: 'block',
            width: 'calc(100% - 20px)',
          },
        }}
      >
        <CircleIcon width={50} height={50} icon={data?.customer?.picture?.filename} />
        <Box sx={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: '10px' }}>
            <TextEllipsis>{data?.customer?.displayName}</TextEllipsis>
            <Box display='flex'><TextEllipsis>{data?.customer?.contact}</TextEllipsis></Box>
        </Box>
      </Box>
      <Box
        className='loan'
        sx={{
          position: 'relative',
          padding: '20px',
          display: 'flex', 
          flexDirection: 'column',
          gap: '10px',
          '&::before': {
            content: `''`,
            borderBottom: theme.border.dashed,
            position: 'absolute',
            bottom: -1,
            left: 10,
            display: 'block',
            width: 'calc(100% - 20px)',
          },
        }}
      >
        <FlexBetween>
          <span>{language['INVOICE']}:</span>
          <span>{data?.payment?.invoice}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['LOAN_DURATION']}:</span>
          <span>{durationFormat(data?.duration?.value, data?.duration?.time)}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['APPLY_RATE']}:</span>
          <span>{currencyFormat(data?.interest?.value, data?.interest?.currency)}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_LOAN']}:</span>
          <span>{currencyFormat(data?.totalLoan?.USD, 'USD')}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_PAID']}</span>
          <span>{currencyFormat(data?.totalPaid?.total, 'USD', 2)}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_REMAIN']}:</span>
          <span>{currencyFormat(data?.totalRemain?.USD, 'USD')}</span>
        </FlexBetween>
      </Box>
      <Box
        className='loan'
        sx={{
          padding: '20px',
          display: 'flex', 
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['PREPAYMENT_PENALTY']}:</span>
          <span>{currencyFormat(data?.prepayment?.value, data?.prepayment?.currency)} / {durationFormat(data?.prepayment?.duration?.value, data?.prepayment?.duration?.time)}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['OVERDUE_PENALTY']}:</span>
          <span>{currencyFormat(data?.overdue?.value, data?.overdue?.currency)} / {durationFormat(data?.overdue?.duration?.value, data?.overdue?.duration?.time)}</span>
        </FlexBetween>
      </Box>
    </Box>
  )
}

export default LoanDetail
