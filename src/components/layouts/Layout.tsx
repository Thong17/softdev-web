import { styled } from '@mui/system'
import { FC, ReactElement } from 'react'
import Footer from 'components/shared/Footer'
import Sidebar from 'components/shared/Sidebar'
import Navbar from 'components/shared/Navbar'

const WrapContainer = styled('div')({
  marginLeft: 86,
  width: 'calc(100% - 86px)',
  height: '100vh',
})

const ContentContainer = styled('div')({
  width: '100%',
  minHeight: 'calc(100% - 100px)',
})

interface ILayout {
  navbar?: ReactElement
}

export const Layout: FC<ILayout> = ({ children, navbar }) => {
  return (
    <>
      <Sidebar></Sidebar>
      <WrapContainer>
        <Navbar>{navbar}</Navbar>
        <ContentContainer sx={{ backgroundColor: 'background.default', color: 'text.primary' }}>{children}</ContentContainer>
        <Footer></Footer>
      </WrapContainer>
    </>
  )
}
