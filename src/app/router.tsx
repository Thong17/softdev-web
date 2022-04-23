import { RouteObject } from "react-router";
import { Login } from "../modules/auth/Login";
import { Admin, User, Role } from "../modules/admin";
import { Counter } from "../modules/counter/Counter";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Counter />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/admin',
        element: <Admin />,
        children: [
            {
                path: '/admin/user',
                element: <User />
            },
            {
                path: '/admin/role',
                element: <Role />
            }
        ]
    },
    
]

export default routes