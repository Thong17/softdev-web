import { Box } from '@mui/material'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { currencyFormat, durationFormat } from 'utils/index'
import { CircleIcon } from '../table/CustomIcon'
import { TextEllipsis } from '../TextEllipsis'

const LoanDetail = ({ data }) => {
  console.log(data);
  
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
          padding: '20px',
          display: 'flex', 
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <Box display='flex'>
          <span style={{ marginRight: '5px' }}>{language['INVOICE']}:</span>
          <TextEllipsis>{data?.payment?.invoice}</TextEllipsis>
        </Box>
        <Box display='flex'>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_LOAN']}:</span>
          <TextEllipsis>{currencyFormat(data?.totalLoan?.USD, 'USD')}</TextEllipsis>
        </Box>
        <Box display='flex'>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_PAID']}:</span>
          <TextEllipsis>{currencyFormat(data?.totalPaid?.total, 'USD')}</TextEllipsis>
        </Box>
        <Box display='flex'>
          <span style={{ marginRight: '5px' }}>{language['TOTAL_REMAIN']}:</span>
          <TextEllipsis>{currencyFormat(data?.totalRemain?.USD, 'USD')}</TextEllipsis>
        </Box>
        <Box display='flex'>
          <span style={{ marginRight: '5px' }}>{language['DURATION']}:</span>
          <TextEllipsis>{durationFormat(data?.duration?.value, data?.duration?.time)}</TextEllipsis>
        </Box>
      </Box>
    </Box>
  )
}

export default LoanDetail
