import useTheme from 'hooks/useTheme'
import React, { ReactElement } from 'react'

const Container = ({
  children,
  header,
}: {
  children: any
  header?: ReactElement
}) => {
  const { theme } = useTheme()
  const HEADER_HEIGHT = header ? 30 : 0

  return (
    <>
      <div
        style={{
          padding: '0 40px',
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {header}
      </div>
      <div
        style={{
          backgroundColor: theme.background.secondary,
          padding: 30,
          margin: header ? '20px 30px 0 30px' : '0 30px 0 30px',
          minHeight: header
            ? 'calc(100vh - 280px)'
            : 'calc(100vh - 230px)',
          borderRadius: theme.radius.primary,
          boxShadow: theme.shadow.container,
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Container
