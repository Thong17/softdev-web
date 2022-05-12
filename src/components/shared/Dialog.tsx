import React from 'react'

const Dialog = ({ display, children }: { display: boolean; children: any }) => {
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
