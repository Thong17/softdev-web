import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'

const stages = {
  report: [
    {
      title: 'Report',
    },
  ],
}
declare type page = 'report'

const ReportBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page, title }) => {
  return <Breadcrumb stages={stages[page]} title={title} />
}

export default ReportBreadcrumbs
