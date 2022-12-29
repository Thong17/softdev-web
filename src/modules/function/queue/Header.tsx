import Breadcrumbs from '../components/Breadcrumbs'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'

export const Header = ({
  styled,
}) => {
  return (
    <DefaultHeader
      styled={styled}
      breadcrumb={<Breadcrumbs page='queue' />}
    />
  )
}
