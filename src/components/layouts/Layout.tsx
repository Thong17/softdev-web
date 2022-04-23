import { styled } from "@mui/system";
import { FC, ReactElement } from "react";
import Footer from "components/shared/Footer";

const WrapContainer = styled('div')({
  backgroundColor: '#f2f2f2',
  marginLeft: 86,
  width: 'calc(100% - 86px)',
  height: '100vh'
})

const ContentContainer = styled('div')({
  width: '100%',
  backgroundColor: '#eee',
  minHeight: 'calc(100% - 100px)'
})

interface ILayout {
  navbar?: ReactElement
}

export const Layout: FC<ILayout> = ({ children, navbar }) => {
  return (
      <WrapContainer>
        {navbar}
        <ContentContainer>
          {children}
        </ContentContainer>
        <Footer></Footer>
      </WrapContainer>
  );
}
