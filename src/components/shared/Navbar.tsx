import { Stack } from "@mui/material"
import { styled } from "@mui/system"
import AuthGuard from "auth/AuthGuard"

const CustomNavbar = styled(Stack)({
    '& a.active': {
        backgroundColor: '#aaa'
    },
    backgroundColor: '#ccc',
    height: 50
})

const Navbar = ({ children }) => {
    return (
        <CustomNavbar direction="row" alignItems="center" justifyContent="space-evenly">
            {children}
            <AuthGuard />
        </CustomNavbar>
    )
}

export default Navbar