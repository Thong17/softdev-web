import { RouteObject } from 'react-router'
import AuthGuard from '../auth/AuthGuard'
import { Login } from 'modules/auth/Login'
import { Register } from 'modules/auth/Register'
import {
  Admin,
  Roles,
  CreateRole,
  UpdateRole,
  DetailRole,
  Users,
  CreateUser,
  UpdateUser,
  DetailUser,
} from 'modules/admin'
import {
  Function,
} from 'modules/function'
import {
  Organize,
  Brands,
  Categories,
  CreateCategory,
  DetailCategory,
  UpdateCategory,
  CreateBrand,
  DetailBrand,
  UpdateBrand,
  Products,
  CreateProduct,
  DetailProduct,
  UpdateProduct,
  ProductSetup,
  Store,
  UpdateStore,
  LayoutForm,
} from 'modules/organize'
import {
  Cashing,
  CreatePromotion,
  DetailPromotion,
  Promotions,
  Reservation,
  ReservationForm,
  Sale,
  Stock,
  Stocks,
  UpdatePromotion,
} from 'modules/sale'
import { Home } from 'modules/home'
import Config from 'modules/config/Config'
import NotFound from 'components/shared/NotFound'
import { SaleReport, Report } from 'modules/report'
import { ProductReport } from 'modules/report/ProductReport'
import { StaffReport } from 'modules/report/StaffReport'
import { Transactions } from 'modules/report/transaction'
import { Payments } from 'modules/report/payment'
import { PaymentStore } from 'modules/organize/store/Payment'
import { UserProfile } from 'modules/auth/UserProfile'
import { UserChangePassword } from 'modules/auth/UserChangePassword'
import { HintButton } from 'components/shared/HintButton'
import { Queue } from 'modules/function/queue'
import { Loan } from 'modules/function/loan'
import { DetailLoan } from 'modules/function/loan/Detail'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
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
    path: '/user/:id',
    element: <UserProfile />,
  },
  {
    path: '/change-password/:id',
    element: <UserChangePassword />,
  },
  {
    path: '/admin',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'admin' }}>
        <Admin />
      </AuthGuard>
    ),
    children: [
      {
        path: 'user',
        element: (
          <AuthGuard role={{ route: 'user', action: 'list' }}>
            <Users />
            <HintButton playlistId='PLHX_VLeC9D-7V5WOxVhHQ6xDFSqHNh2OC' />
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
            <HintButton playlistId='PLHX_VLeC9D-7V5WOxVhHQ6xDFSqHNh2OC' />
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
    path: '/function',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'function' }}>
        <Function />
      </AuthGuard>
    ),
    children: [
      {
        path: 'queue',
        element: (
          <AuthGuard role={{ route: 'function', action: 'queue' }}>
            <Queue />
            <HintButton playlistId='PLHX_VLeC9D-580BaHqtz7FJFifDvA6lqx' />
          </AuthGuard>
        ),
      },
      {
        path: 'loan',
        element: (
          <AuthGuard role={{ route: 'function', action: 'loan' }}>
            <Loan />
            <HintButton playlistId='PLHX_VLeC9D-580BaHqtz7FJFifDvA6lqx' />
          </AuthGuard>
        ),
      },
      {
        path: 'loan/:id',
        element: (
          <AuthGuard role={{ route: 'loan', action: 'detail' }}>
            <DetailLoan />
            <HintButton playlistId='PLHX_VLeC9D-580BaHqtz7FJFifDvA6lqx' />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/organize',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'organize' }}>
        <Organize />
      </AuthGuard>
    ),
    children: [
      // Category
      {
        path: 'category',
        element: (
          <AuthGuard role={{ route: 'category', action: 'list' }}>
            <Categories />
            <HintButton playlistId='PLHX_VLeC9D-6Ikbr2cQThon9FadJEz6sP' />
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
        element: (
          <AuthGuard role={{ route: 'brand', action: 'list' }}>
            <Brands />
            <HintButton playlistId='PLHX_VLeC9D-6Ikbr2cQThon9FadJEz6sP' />
          </AuthGuard>
        ),
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
        element: (
          <AuthGuard role={{ route: 'product', action: 'list' }}>
            <Products />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },
      {
        path: 'product/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreateProduct />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },
      {
        path: 'product/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdateProduct />
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
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
            <HintButton playlistId='PLHX_VLeC9D-78msvumaCBdk2x668hpA0x' />
          </AuthGuard>
        ),
      },

      // Store
      {
        path: 'store',
        element: <>
          <Store />
          <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
        </>,
      },
      {
        path: 'store/update/:id',
        element: (
          <AuthGuard role={{ route: 'store', action: 'update' }}>
            <UpdateStore />
            <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
          </AuthGuard>
        ),
      },
      {
        path: 'store/:id/payment',
        element: (
          <AuthGuard role={{ route: 'store', action: 'update' }}>
            <PaymentStore />
            <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
          </AuthGuard>
        ),
      },
      {
        path: 'store/:id/layout',
        element: (
          <AuthGuard role={{ route: 'store', action: 'update' }}>
            <LayoutForm />
            <HintButton playlistId='PLHX_VLeC9D-7KeYZ8xcW3cUdTm_3xcnhH' />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/sale',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'operation' }}>
        <Sale />
      </AuthGuard>
    ),
    children: [
      // Stock
      {
        path: 'stock',
        element: <>
          <Stocks />
          <HintButton playlistId='PLHX_VLeC9D-6dfu3mnwiaK5iq9KnN4vhg' />
        </>,
      },
      {
        path: 'stock/item/:id',
        element: <Stock />,
      },

      // Cashing
      {
        path: 'cashing',
        element: <>
          <Cashing />        
          <HintButton playlistId='PLHX_VLeC9D-68Mw8MY1B7w9R_jdN5LJ4C' />
        </>
      },

      // Reservation
      {
        path: 'reservation',
        element: <>
          <Reservation />      
          <HintButton playlistId='PLHX_VLeC9D-68Mw8MY1B7w9R_jdN5LJ4C' />
        </>
      },
      {
        path: 'reservation/:id',
        element: <ReservationForm />,
      },

      // Promotion
      {
        path: 'promotion',
        element: <Promotions />,
      },
      {
        path: 'promotion/create',
        element: (
          <AuthGuard role={{ route: 'category', action: 'create' }}>
            <CreatePromotion />
          </AuthGuard>
        ),
      },
      {
        path: 'promotion/update/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'update' }}>
            <UpdatePromotion />
          </AuthGuard>
        ),
      },
      {
        path: 'promotion/detail/:id',
        element: (
          <AuthGuard role={{ route: 'category', action: 'detail' }}>
            <DetailPromotion />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/report',
    element: (
      <AuthGuard role={{ route: 'menu', action: 'report' }}>
        <Report />
      </AuthGuard>
    ),
    children: [
      {
        path: 'sale',
        element: <SaleReport />,
      },
      {
        path: 'product',
        element: <ProductReport />,
      },
      {
        path: 'staff',
        element: <StaffReport />,
      },
      {
        path: 'transaction',
        element: <Transactions />,
      },
      {
        path: 'payment',
        element: <Payments />,
      },
    ],
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
