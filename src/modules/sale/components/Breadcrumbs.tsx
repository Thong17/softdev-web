import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'

const stages = {
  sale: [
    {
      title: 'Sale',
    },
  ],
}
declare type page = 'sale'

const SaleBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page, title }) => {
  return <Breadcrumb stages={stages[page]} title={title} />
}

export default SaleBreadcrumbs
