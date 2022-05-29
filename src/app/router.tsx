import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
import { Register } from 'modules/auth/Register'
import { Admin, Roles, CreateRole, UpdateRole, DetailRole, Users, CreateUser, UpdateUser, DetailUser } from 'modules/admin'
import { Store, Category, Brand, CreateCategory } from 'modules/store'
import { Sale } from 'modules/sale'
import { Report } from 'modules/report'
import { Counter } from 'modules/counter/Counter'
import Config from 'modules/config/Config'
import { Test } from 'modules/admin/test'
import NotFound from 'components/shared/NotFound'

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
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin',
    element: (<AuthGuard role={{ route: 'admin', action: 'list' }}><Admin /></AuthGuard>),
    children: [
      {
        path: 'user',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Users />
          </AuthGuard>
        ),
      },
      {
        path: 'user/create',
        element: (
          <AuthGuard role={{ route: 'user', action: 'create' }}>
            <CreateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/update/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'update' }}>
            <UpdateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'user/detail/:id',
        element: (
          <AuthGuard role={{ route: 'user', action: 'detail' }}>
            <DetailUser />
          </AuthGuard>
        ),
      },
      {
        path: 'test',
        element: (
          <Test />
        ),
      },
      {
        path: 'role',
        element: (
          <AuthGuard role={{ route: 'role', action: 'list' }}>
            <Roles />
          </AuthGuard>
        ),
      },
      {
        path: 'role/create',
        element: (
          <AuthGuard role={{ route: 'role', action: 'create' }}>
            <CreateRole />
          </AuthGuard>
        ),
      },
      {
        path: 'role/update/:id',
        element: (
          <AuthGuard role={{ route: 'role', action: 'update' }}>
            <UpdateRole />
          </AuthGuard>
        ),
      },
      {
        path: 'role/detail/:id',
        element: (
          <AuthGuard role={{ route: 'role', action: 'detail' }}>
            <DetailRole />
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
        path: 'brand',
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
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
