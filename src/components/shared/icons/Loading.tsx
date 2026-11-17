import { CircularProgress } from '@mui/material'

const Loading = () => {
  return (
    <div
      style={{
        // Covers the button it sits in, over the button's hidden label
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        style={{
          width: 18,
          height: 18,
          color: 'inherit',
        }}
      />
    </div>
  )
}

export default Loading
