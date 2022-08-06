import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'

const stages = {
  sale: [
    {
      title: 'Sale',
    },
  ],
  stock: [
    {
      title: 'Sale',
      path: '/sale'
    },
    {
      title: 'Stock',
    }
  ],
  promotion: [
    {
      title: 'Sale',
      path: '/sale'
    },
    {
      title: 'Promotion',
    }
  ],
  promotionCreate: [
    {
      title: 'Sale',
      path: '/sale'
    },
    {
      title: 'Promotion',
      path: '/sale/promotion'
    },
    {
      title: 'Create',
    }
  ],
  promotionUpdate: [
    {
      title: 'Sale',
      path: '/sale'
    },
    {
      title: 'Promotion',
      path: '/sale/promotion'
    },
    {
      title: 'Update',
    }
  ]
}
declare type page = 'sale' | 'stock' | 'promotion' | 'promotionCreate' | 'promotionUpdate'

const SaleBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<AttachMoneyRoundedIcon />} />
}

export default SaleBreadcrumbs
