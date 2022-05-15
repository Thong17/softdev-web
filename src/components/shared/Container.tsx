import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { FC, ReactElement } from 'react'

interface IContainer {
  children: any
  header?: ReactElement
}

const Container: FC<IContainer> = ({ children, header }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const HEADER_HEIGHT = header ? 30 : 0
  const SPACE_SIDE = device !== 'mobile' ? 30 : 10
  const SPACE_TOP = device !== 'mobile' ? 10 : 10
  const MOBILE_HEIGHT = header
    ? `calc(100vh - ${250 - HEADER_HEIGHT - SPACE_TOP}px)`
    : `calc(100vh - ${180 - HEADER_HEIGHT - SPACE_TOP}px)`
  const CONTAINER_HEIGHT = header
    ? 'calc(100vh - 260px)'
    : 'calc(100vh - 220px)'

  return (
    <>
      <div
        style={{
          padding: device !== 'mobile' ? '0 40px' : '0 20px',
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
          padding: SPACE_SIDE,
          margin: header
            ? `${SPACE_TOP}px ${SPACE_SIDE}px 0 ${SPACE_SIDE}px`
            : `0 ${SPACE_SIDE}px 0 ${SPACE_SIDE}px`,
          minHeight: device !== 'mobile' ? CONTAINER_HEIGHT : MOBILE_HEIGHT,
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
