import { Box } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { CustomButton } from 'styles/index'
import { currencyFormat, durationFormat } from 'utils/index'
import { CircleIcon } from '../table/CustomIcon'
import { TextEllipsis } from '../TextEllipsis'
import { FlexBetween } from './FlexBetween'

export const renderDirection = (direction, theme): any => {
  if (direction === 'row') {
    return {
      borderRight: theme.border.dashed,
      position: 'absolute',
      top: 10,
      right: -1,
      height: 'calc(100% - 20px)',
    }
  } else {
    return {
      borderBottom: theme.border.dashed,
      position: 'absolute',
      left: 10,
      bottom: -1,
      width: 'calc(100% - 20px)',
    }
  }
}

const LoanDetail = ({ data, direction = 'row', backgroundColor }: any) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        width: '100%',
        '& .customer, & .loan': {
          backgroundColor: backgroundColor || theme.background.primary,
          borderRadius: theme.radius.ternary
        }
      }}
    >
      <Box
        className='customer'
        sx={{
          padding: '20px',
          display: 'flex',
          flex: '10%',
          position: 'relative',
          flexDirection: 'column',
          gap: '10px',
          '&::before': {
            content: `''`,
            ...renderDirection(direction, theme),
            display: 'block',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <CircleIcon
            width={50}
            height={50}
            icon={data?.customer?.picture?.filename}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              padding: '10px',
            }}
          >
            <TextEllipsis>{data?.customer?.displayName}</TextEllipsis>
            <Box display='flex'>
              <TextEllipsis>{data?.customer?.contact}</TextEllipsis>
            </Box>
          </Box>
        </Box>
        <CustomButton
          styled={theme}
          sx={{
            backgroundColor: `${theme.color.info}22`,
            color: theme.color.info,
          }}
        >
          {language['VIEW_ATTACHMENT']}
        </CustomButton>
      </Box>
      <Box
        className='loan'
        sx={{
          position: 'relative',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: '20%',
          '&::before': {
            content: `''`,
            ...renderDirection(direction, theme),
            display: 'block',
          },
        }}
      >
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>
            {language['LOAN_DURATION']}:
          </span>
          <span>
            {durationFormat(data?.duration?.value, data?.duration?.time)}
          </span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_LOAN']}:</span>
          <span>{currencyFormat(data?.totalLoan?.USD, 'USD')}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_PAID']}:</span>
          <span>{currencyFormat(data?.totalPaid?.total, 'USD', 2)}</span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>
            {language['TOTAL_REMAIN']}:
          </span>
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
          flex: '20%',
        }}
      >
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>{language['APPLY_RATE']}:</span>
          <span>
            {currencyFormat(data?.interest?.value, data?.interest?.currency)} /{' '}
            {durationFormat(1, 'month')}
          </span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>
            {language['PREPAYMENT_PENALTY']}:
          </span>
          <span>
            {currencyFormat(
              data?.prepayment?.value,
              data?.prepayment?.currency
            )}{' '}
            /{' '}
            {durationFormat(
              data?.prepayment?.duration?.value,
              data?.prepayment?.duration?.time
            )}
          </span>
        </FlexBetween>
        <FlexBetween>
          <span style={{ marginRight: '5px' }}>
            {language['OVERDUE_PENALTY']}:
          </span>
          <span>
            {currencyFormat(data?.overdue?.value, data?.overdue?.currency)} /{' '}
            {durationFormat(
              data?.overdue?.duration?.value,
              data?.overdue?.duration?.time
            )}
          </span>
        </FlexBetween>
      </Box>
    </Box>
  )
}

export default LoanDetail
