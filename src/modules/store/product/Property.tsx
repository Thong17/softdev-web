
import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import NotFound from 'components/shared/NotFound'

const Header = ({ stages }) => {
    return <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
}

export const PropertyProduct = () => {
    const { id, action } = useParams()
    if (action !== 'create' && action !== 'update') return <NotFound />

    const propertyBreadcrumb =  [
        {
          title: 'Store',
          path: '/store'
        },
        {
          title: 'Product',
          path: '/store/product'
        },
        {
          title: action === 'create' ? 'Create' : 'Update',
          path: action === 'create' ? '/store/product/create' : `/store/product/update/${id}`
        },
        {
          title: 'Property'
        }
      ]

  return (
    <Container header={<Header stages={propertyBreadcrumb} />}>
        Hello
    </Container>
  )
}
