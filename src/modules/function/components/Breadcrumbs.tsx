import Breadcrumb from 'components/shared/Breadcrumbs'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import { FC } from 'react'
import useLanguage from 'hooks/useLanguage'

declare type page =
  | 'function'
  | 'queue'
  | 'loan'
  | 'promotion'
  | 'promotionCreate'
  | 'promotionUpdate'

interface IBreadcrumbs {
  page: page
  title?: string
}

const Breadcrumbs: FC<IBreadcrumbs> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
    function: [
      {
        title: language['FUNCTION'],
      },
    ],
    queue: [
      {
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['QUEUE'],
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
  return (
    <Breadcrumb
      stages={stages[page]}
      title={<ConfirmationNumberRoundedIcon />}
    />
  )
}

export default Breadcrumbs
