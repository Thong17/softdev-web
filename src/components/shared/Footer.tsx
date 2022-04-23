import { styled } from "@mui/system"
import { Stack } from "@mui/material"

const CustomFooter = styled(Stack)({
    width: '100%',
    backgroundColor: '#aaa',
    height: 50
})

const Footer = () => {
  return (
    <CustomFooter direction="row" justifyContent="center" alignItems="center">Footer</CustomFooter>
  )
}

export default Footer