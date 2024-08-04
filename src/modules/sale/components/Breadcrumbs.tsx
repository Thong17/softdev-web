import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import useLanguage from 'hooks/useLanguage'

declare type page =
  | 'loan'
  | 'sale'
  | 'stock'
  | 'transaction'

const SaleBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
    loan: [
      {
        title: language['SALE'],
        path: '/sale',
      },
      {
        title: language['LOAN'],
      },
    ],
    sale: [
      {
        title: language['SALE'],
      },
    ],
    stock: [
      {
        title: language['SALE'],
        path: '/sale',
      },
      {
        title: language['STOCK'],
      },
    ],
  }
  return <Breadcrumb stages={stages[page]} title={<PriceChangeRoundedIcon />} />
}

export default SaleBreadcrumbs
