import { RouteObject } from "react-router";
import AuthGuard from '../auth/AuthGuard'
import { Login } from "modules/auth/Login";
import { Admin, User, Role } from "modules/admin";
import { Counter } from "modules/counter/Counter";

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
                path: 'user',
                element: <AuthGuard role={{route: 'user', action: 'list'}}><User /></AuthGuard>
            },
            {
                path: 'role',
                element: <Role />
            }
        ]
    },

]

export default routes