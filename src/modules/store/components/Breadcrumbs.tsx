import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { stages } from './constant'

declare type page = 'store' | 'category' | 'categoryCreate' | 'categoryUpdate'

const StoreBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  return <Breadcrumb stages={stages[page]} title={<StorefrontRoundedIcon />} />
}

export default StoreBreadcrumbs
