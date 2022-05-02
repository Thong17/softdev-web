import { RouteObject } from "react-router";
import AuthGuard from '../auth/AuthGuard'
import { Login } from "modules/auth/Login";
import { Admin, User, Role } from "modules/admin";
import { Counter } from "modules/counter/Counter";
import Config from "modules/config/Config";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <AuthGuard role={{route: 'admin', action: 'list'}}><Counter /></AuthGuard>
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
                path: 'user',
                element: <AuthGuard role={{route: 'user', action: 'list'}}><User /></AuthGuard>
            },
            {
                path: 'role',
                element: <AuthGuard role={{route: 'admin', action: 'list'}}><Role /></AuthGuard>
            }
        ]
    },
    {
        path: '/config',
        element: <Config />
    }
]

export default routes