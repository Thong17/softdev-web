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
  | 'announcement'
  | 'announcementCreate'
  | 'announcementUpdate'

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
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['PROMOTION'],
      },
    ],
    promotionCreate: [
      {
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['PROMOTION'],
        path: '/function/promotion',
      },
      {
        title: language['CREATE'],
      },
    ],
    promotionUpdate: [
      {
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['PROMOTION'],
        path: '/function/promotion',
      },
      {
        title: language['UPDATE'],
      },
    ],
    announcement: [
      {
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['ANNOUNCEMENT'],
      },
    ],
    announcementCreate: [
      {
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['ANNOUNCEMENT'],
        path: '/function/announcement',
      },
      {
        title: language['CREATE'],
      },
    ],
    announcementUpdate: [
      {
        title: language['FUNCTION'],
        path: '/function',
      },
      {
        title: language['ANNOUNCEMENT'],
        path: '/function/announcement',
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
