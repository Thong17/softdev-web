import { styled } from '@mui/system'
import { FC, ReactElement } from 'react'
import Footer from 'components/shared/Footer'
import Sidebar from 'components/shared/Sidebar'
import Navbar from 'components/shared/Navbar'
import useTheme from 'hooks/useTheme'
import useConfig from 'hooks/useConfig'

const WrapContainer = styled('div')({
  height: '100vh',
  transition: '0.3s ease'
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

  return (
    <div style={{ background: theme.background.primary }}>
      <Sidebar></Sidebar>
      <WrapContainer
        style={{
          marginLeft: sidebar ? 266 : 86,
          width: sidebar ? 'calc(100% - 266px)' : 'calc(100% - 86px)',
        }}
      >
        <Navbar>{navbar}</Navbar>
        <ContentContainer
          style={{
            backgroundColor: theme.background.secondary,
            color: theme.text.primary,
            transition: '0.3s ease',
          }}
        >
          {children}
        </ContentContainer>
        <Footer></Footer>
      </WrapContainer>
    </div>
  )
}
