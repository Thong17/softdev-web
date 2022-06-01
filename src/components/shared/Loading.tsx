import React from 'react'
import useTheme from 'hooks/useTheme'
import { CustomLoading } from 'styles'
import { CircularProgress } from '@mui/material'

const Loading = () => {
  const { theme } = useTheme()
  
  return <CustomLoading styled={theme}><CircularProgress /></CustomLoading>
}

export default Loading
