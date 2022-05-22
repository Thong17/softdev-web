import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
import { Admin, User, Role } from 'modules/admin'
import { Store, Category, Brand, CreateCategory } from 'modules/store'
import { Sale } from 'modules/sale'
import { Report } from 'modules/report'

import { Counter } from 'modules/counter/Counter'
import Config from 'modules/config/Config'

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthGuard role={{ route: 'admin', action: 'list' }}>
        <Counter />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [
      {
        path: 'user',
        element: (
          <AuthGuard role={{ route: 'admin', action: 'list' }}>
            <User />
          </AuthGuard>
        ),
      },
      {
        path: 'role',
        element: (
          <AuthGuard role={{ route: 'admin', action: 'list' }}>
            <Role />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/store',
    element: <Store />,
    children: [
      {
        path: 'category',
        element: (
          <AuthGuard role={{ route: 'admin', action: 'list' }}>
            <Category />
          </AuthGuard>
        ),
      },
      {
        path: 'category/create',
        element: (
          <AuthGuard role={{ route: 'admin', action: 'list' }}>
            <CreateCategory />
          </AuthGuard>
        ),
      },
      {
        path: '/store/brand',
        element: <Brand />,
      },
    ],
  },
  {
    path: '/sale',
    element: <Sale />,
  },
  {
    path: '/report',
    element: <Report />,
  },
  {
    path: '/config',
    element: <Config />,
  },
]

export default routes
