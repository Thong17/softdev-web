import { Box } from '@mui/material'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { CircleIcon } from '../table/CustomIcon'
import { TextEllipsis } from '../TextEllipsis'

const LoanDetail = ({ data }) => {
  const { theme } = useTheme()
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
            <TextEllipsis>{data?.customer?.contact}</TextEllipsis>
        </Box>
      </Box>
      <Box
        className='loan'
        sx={{
          padding: '20px',
        }}
      >
        Loan detail
      </Box>
    </Box>
  )
}

export default LoanDetail
