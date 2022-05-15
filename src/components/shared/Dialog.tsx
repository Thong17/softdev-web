import { FC } from 'react'

interface IDialog {
  display: boolean
  children: any
}

const Dialog: FC<IDialog> = ({ display, children }) => {
  return (
    <div
      style={
        display
          ? {
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }
          : {}
      }
    >
      {children}
    </div>
  )
}

export default Dialog
