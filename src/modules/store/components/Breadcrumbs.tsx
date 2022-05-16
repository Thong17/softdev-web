import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'

const stages = {
  store: [
    {
      title: 'Store',
    },
  ],
  category: [
    {
      title: 'Store',
      path: '/store'
    },
    {
      title: 'Category',
    },
  ],
}
declare type page = 'store' | 'category'

const StoreBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<StorefrontRoundedIcon />} />
}

export default StoreBreadcrumbs
