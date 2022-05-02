import { Stack } from "@mui/material"
import { styled } from "@mui/system"
import useAuth from "hooks/useAuth"
import { Link } from "react-router-dom"
import Profile from "./Profile"

const CustomNavbar = styled(Stack)({
    '& a.active': {
        backgroundColor: '#aaa'
    },
    backgroundColor: '#ccc',
    height: 50
})

const Navbar = ({ children }) => {
    const { user } = useAuth()

    return (
        <CustomNavbar direction="row" alignItems="center" justifyContent="space-between">
            <div>{children}</div>
            { user ? <Profile username={ user.username } /> : <Link to="/login">Login</Link>}
        </CustomNavbar>
    )
}

export default Navbar