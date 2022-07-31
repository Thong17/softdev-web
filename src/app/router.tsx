import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
import { Register } from 'modules/auth/Register'
import { Admin, Roles, CreateRole, UpdateRole, DetailRole, Users, CreateUser, UpdateUser, DetailUser } from 'modules/admin'
import { Organize, Brands, Categories, CreateCategory, DetailCategory, UpdateCategory, CreateBrand, DetailBrand, UpdateBrand, Products, CreateProduct, DetailProduct, UpdateProduct, ProductSetup, Store, UpdateStore, StructureForm } from 'modules/organize'
import { Sale, Stock, Stocks } from 'modules/sale'
import { Report } from 'modules/report'
import { Counter } from 'modules/counter/Counter'
import Config from 'modules/config/Config'
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
    path: '/organize',
    element: <Organize />,
    children: [
      // Category
      {
        path: 'category',
        element: (
          <AuthGuard role={{ route: 'category', action: 'list' }}>
            <Categories />
          </AuthGuard>
        ),
      },
      {
        path: 'category/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateCategory />
          </AuthGuard>
        ),
      },
      {
        path: 'category/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateCategory />
          </AuthGuard>
        ),
      },
      {
        path: 'category/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailCategory />
          </AuthGuard>
        ),
      },

      // Brand
      {
        path: 'brand',
        element: <Brands />,
      },
      {
        path: 'brand/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateBrand />
          </AuthGuard>
        ),
      },
      {
        path: 'brand/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateBrand />
          </AuthGuard>
        ),
      },
      {
        path: 'brand/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailBrand />
          </AuthGuard>
        ),
      },

      // Product
      {
        path: 'product',
        element: <Products />,
      },
      {
        path: 'product/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateProduct />
          </AuthGuard>
        ),
      },
      {
        path: 'product/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateProduct />
          </AuthGuard>
        ),
      },
      {
        path: 'product/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailProduct />
          </AuthGuard>
        ),
      },
      {
        path: 'product/:action/property/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <ProductSetup />
          </AuthGuard>
        ),
      },

      // Store
      {
        path: 'store',
        element: <Store />,
      },
      {
        path: 'store/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateStore />
          </AuthGuard>
        ),
      },
      {
        path: 'store/:id/structure',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <StructureForm />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/sale',
    element: <Sale />,
    children: [
      {
        path: 'stock',
        element: <Stocks />,
      },
      {
        path: 'stock/item/:id',
        element: <Stock />,
      }
    ]
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
