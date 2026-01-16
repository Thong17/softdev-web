import { Box } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import { CustomButton } from 'styles/index'
import { currencyFormat, durationFormat } from 'utils/index'
import { CircleIcon } from '../table/CustomIcon'
import { TextEllipsis } from '../TextEllipsis'
import { FlexBetween } from './FlexBetween'
import { NotificationLabel } from '../NotificationLabel'
import { AttachmentDialog } from 'modules/sale/loan/AttachmentDialog'

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
  const [attachmentDialog, setAttachmentDialog] = useState({
    open: false,
    attachments: [],
  })

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
        <div style={{position: 'relative'}}>
          <CustomButton
            onClick={() => setAttachmentDialog({ open: true, attachments: data?.attachments || [] })}
            disabled={!data?.attachments?.length}
            styled={theme}
            sx={{
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
              width: '100%',
            }}
          >
            {language['VIEW_ATTACHMENT']}
          </CustomButton>
          {data?.attachments?.length > 0 && <NotificationLabel value={data?.attachments?.length || 0} top={-5} right={-5} borderRadius={'50%'} />}
        </div>
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
          <span>{currencyFormat(data?.totalPaid?.value, data?.totalPaid?.currency)}</span>
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
          <AttachmentDialog
            dialog={attachmentDialog}
            setDialog={setAttachmentDialog}
          />
      </Box>
    </Box>
  )
}

export default LoanDetail
