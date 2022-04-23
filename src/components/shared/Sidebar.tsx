import { NavLink } from "react-router-dom";
import { sideNav } from "../layouts/constant";
import { Stack } from "@mui/material";
import { styled } from "@mui/system";

const CustomSideNav = styled(Stack)({
    width: 70,
    height: 'calc(100vh - 16px)',
    backgroundColor: '#ccc',
    borderRadius: 10,
    margin: 8,
    position: 'fixed',
    '& a.active': {
        backgroundColor: '#092736'
    }
})

const Sidebar = () => {
    return <CustomSideNav direction='column' justifyContent='space-around' alignItems='center'>
        { sideNav.map((nav, index) =>
            <NavLink key={index} to={nav.route}>{nav.title}</NavLink>
        ) }
    </CustomSideNav>

};

export default Sidebar;
