import { Stack } from "@mui/material"
import { styled } from "@mui/system"
import { FC } from 'react'

const CustomNavbar = styled(Stack)({
    '& a.active': {
        backgroundColor: '#aaa'
    },
    backgroundColor: '#ccc',
    height: 50
})

const Navbar: FC = ({ children }) => {
    return (
        <CustomNavbar direction="row" alignItems="center" justifyContent="space-evenly">
            {children}
        </CustomNavbar>
    )
}

export default Navbar