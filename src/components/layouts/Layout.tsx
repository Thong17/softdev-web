import { styled } from '@mui/system'
import { FC, ReactElement } from 'react'
import Footer from 'components/shared/Footer'
import Sidebar from 'components/shared/Sidebar'
import Navbar from 'components/shared/Navbar'
import useTheme from 'hooks/useTheme'
import useConfig from 'hooks/useConfig'
import useWeb from 'hooks/useWeb'
import Bottombar from 'components/shared/Bottombar'

const WrapContainer = styled('div')({
  position: 'relative',
  height: '100%',
  transition: '0.3s ease',
})

const ContentContainer = styled('div')({
  width: '100%',
  minHeight: 'calc(100vh - 170px)',
})

const NAVBAR_HEIGHT = 70
interface ILayout {
  navbar?: ReactElement
}

export const Layout: FC<ILayout> = ({ children, navbar }) => {
  const { theme } = useTheme()
  const { sidebar } = useConfig()
  const { device } = useWeb()

  const SIDEBAR_WIDTH = sidebar ? 258 : 78
  const SPACE_TOP = device !== 'mobile' ? 20 : 10

  return (
    <div
      style={{
        background: theme.background.primary,
        fontFamily: theme.font.family,
        fontWeight: theme.font.weight,
        fontSize: theme.responsive[device].text.primary,
      }}
    >
      {device === 'mobile' || device === 'tablet' ? (
        <Bottombar></Bottombar>
      ) : (
        <Sidebar></Sidebar>
      )}
      <WrapContainer
        style={{
          marginLeft:
            device === 'laptop' || device === 'desktop' ? SIDEBAR_WIDTH : '0',
          width:
            device === 'laptop' || device === 'desktop'
              ? `calc(100% - ${SIDEBAR_WIDTH}px)`
              : '100%',
        }}
      >
        <Navbar>{navbar}</Navbar>
        <ContentContainer
          style={{
            position: 'relative',
            color: theme.text.primary,
            paddingTop: NAVBAR_HEIGHT + SPACE_TOP,
          }}
        >
          {children}
        </ContentContainer>
        <Footer></Footer>
      </WrapContainer>
    </div>
  )
}
