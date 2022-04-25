import React from 'react'
import { styled } from '@mui/system'

const CustomLoading = styled('div')({
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255)',
    position: 'fixed'
})

const Loading = () => {
  return (
    <CustomLoading>loading</CustomLoading>
  )
}

export default Loading