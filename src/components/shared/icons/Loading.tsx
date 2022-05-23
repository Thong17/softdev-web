import { CircularProgress } from '@mui/material'

const Loading = () => {
  return (
    <div
      style={{
        backgroundColor: 'inherit',
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        style={{
          width: 21,
          height: 21,
          color: 'inherit',
        }}
      />
    </div>
  )
}

export default Loading
