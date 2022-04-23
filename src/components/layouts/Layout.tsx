import { styled } from "@mui/system";
import { FC, ReactElement } from "react";
import Footer from "components/shared/Footer";

const WrapContainer = styled('div')({
  backgroundColor: '#f2f2f2',
  marginLeft: 86,
  width: 'calc(100% - 86px)',
  height: '100%'
})

const ContentContainer = styled('div')({
  width: '100%',
  backgroundColor: '#eee',
  minHeight: 'calc(100% - 100px)'
})

interface props {
  navbar?: ReactElement
}

export const Layout: FC<props> = ({ children, navbar }) => {
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
