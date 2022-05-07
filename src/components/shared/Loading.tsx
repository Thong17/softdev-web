import React from 'react'
import useTheme from 'hooks/useTheme'
import { CustomLoading } from 'styles'

const Loading = () => {
  const { theme } = useTheme()
  
  return <CustomLoading styled={theme}>loading</CustomLoading>
}

export default Loading
