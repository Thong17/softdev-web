import { styled } from '@mui/system'
import { FC, ReactElement } from 'react'
import Footer from 'components/shared/Footer'
import Sidebar from 'components/shared/Sidebar'
import Navbar from 'components/shared/Navbar'
import useTheme from 'hooks/useTheme'
import useConfig from 'hooks/useConfig'
import useWeb from 'hooks/useWeb'

const WrapContainer = styled('div')({
  height: '100vh',
  transition: '0.3s ease',
})

const ContentContainer = styled('div')({
  width: '100%',
  minHeight: 'calc(100% - 120px)',
})
interface ILayout {
  navbar?: ReactElement
}

export const Layout: FC<ILayout> = ({ children, navbar }) => {
  const { theme } = useTheme()
  const { sidebar } = useConfig()
  const { device } = useWeb()

  const SIDEBAR_WIDTH = sidebar ? 266 : 86
  
  return (
    <div
      style={{
        background: theme.background.primary,
        fontFamily: theme.font.family,
        fontWeight: theme.font.weight,
        fontSize: `${theme.responsive?.[device]?.textSize}px !important`
      }}
    >
      {device !== 'mobile' && <Sidebar></Sidebar>}
      <WrapContainer
        style={{
          marginLeft: device !== 'mobile' ? SIDEBAR_WIDTH : '0',
          width:
            device !== 'mobile' ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
        }}
      >
        <Navbar>{navbar}</Navbar>
        <ContentContainer
          style={{
            backgroundColor: theme.background.secondary,
            color: theme.text.primary,
          }}
        >
          {children}
        </ContentContainer>
        <Footer></Footer>
      </WrapContainer>
    </div>
  )
}
