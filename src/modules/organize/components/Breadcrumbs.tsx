import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import useLanguage from 'hooks/useLanguage'

declare type page = 'organize' | 'category' | 'categoryCreate' | 'categoryUpdate' | 'brand' | 'brandCreate' | 'brandUpdate' | 'product' | 'productCreate' | 'productDetail' | 'productUpdate' | 'storeUpdate' | 'storeLayout' | 'membership' | 'membershipCreate' | 'membershipUpdate' | 'membershipDetail'

const StoreBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page, id }) => {
  const { language } = useLanguage()
  const stages = {
    organize: [
      {
        title: language['ORGANIZE'],
      },
    ],
  
    // Category
    category: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['CATEGORY'],
      },
    ],
    categoryCreate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['CATEGORY'],
        path: '/organize/category'
      },
      {
        title: language['CREATE'],
      },
    ],
    categoryUpdate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['CATEGORY'],
        path: '/organize/category'
      },
      {
        title: language['UPDATE'],
      },
    ],
  
    // Brand
    brand: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['BRAND'],
      },
    ],
    brandCreate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['BRAND'],
        path: '/organize/brand'
      },
      {
        title: language['CREATE'],
      },
    ],
    brandUpdate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['BRAND'],
        path: '/organize/brand'
      },
      {
        title: language['UPDATE'],
      },
    ],
  
    // Product
    product: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['PRODUCT'],
      },
    ],
    productDetail: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['PRODUCT'],
        path: '/organize/product'
      },
      {
        title: language['DETAIL'],
      }
    ],
    productCreate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['PRODUCT'],
        path: '/organize/product'
      },
      {
        title: language['CREATE'],
      }
    ],
    productUpdate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['PRODUCT'],
        path: '/organize/product'
      },
      {
        title: language['UPDATE'],
      },
    ],
  
    // Store
    storeLayout: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['STORE'],
        path: '/organize/store'
      },
      {
        title: language['LAYOUT'],
      },
    ],

    // Membership
    membership: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['MEMBERSHIP'],
      },
    ],
    membershipCreate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['MEMBERSHIP'],
        path: '/organize/membership'
      },
      {
        title: language['CREATE'],
      },
    ],
    membershipUpdate: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['MEMBERSHIP'],
        path: '/organize/membership'
      },
      {
        title: language['UPDATE'],
      },
    ],
    membershipDetail: [
      {
        title: language['ORGANIZE'],
        path: '/organize'
      },
      {
        title: language['MEMBERSHIP'],
        path: '/organize/membership'
      },
      {
        title: language['DETAIL'],
      },
    ],
  }
  let stage = stages[page]
  if (id) {
    stage = [
      ...stage,
      {
        title: language['SETUP'],
        path: `/organize/product/update/property/${id}`
      }
    ]
  }
  return <Breadcrumb stages={stage} title={<StorefrontRoundedIcon />} />
}

export default StoreBreadcrumbs
