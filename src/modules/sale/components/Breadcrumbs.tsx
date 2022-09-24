import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { IBreadcrumbs } from 'constants/interfaces/Breadcrumbs'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import useLanguage from 'hooks/useLanguage'

declare type page =
  | 'sale'
  | 'stock'
  | 'transaction'
  | 'promotion'
  | 'promotionCreate'
  | 'promotionUpdate'

const SaleBreadcrumbs: FC<IBreadcrumbs<page>> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
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
    transaction: [
      {
        title: language['SALE'],
        path: '/sale',
      },
      {
        title: language['TRANSACTION'],
      },
    ],
    promotion: [
      {
        title: language['SALE'],
        path: '/sale',
      },
      {
        title: language['PROMOTION'],
      },
    ],
    promotionCreate: [
      {
        title: language['SALE'],
        path: '/sale',
      },
      {
        title: language['PROMOTION'],
        path: '/sale/promotion',
      },
      {
        title: language['CREATE'],
      },
    ],
    promotionUpdate: [
      {
        title: language['SALE'],
        path: '/sale',
      },
      {
        title: language['PROMOTION'],
        path: '/sale/promotion',
      },
      {
        title: language['UPDATE'],
      },
    ],
  }
  return <Breadcrumb stages={stages[page]} title={<PriceChangeRoundedIcon />} />
}

export default SaleBreadcrumbs
