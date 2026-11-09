import Breadcrumb from 'components/shared/Breadcrumbs'
import { FeatureGate } from 'hooks/useStoreFeatures'
import Container from 'components/shared/Container'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { DetailStore } from 'components/shared/container/DetailStore'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getInfoStore, selectInfoStore } from './redux'
import { useNavigate } from 'react-router-dom'
import { StructureContainer } from 'components/shared/container/StructureContainer'
import { useEffect } from 'react'
import useLanguage from 'hooks/useLanguage'
import { StoreSummary } from './StoreSummary'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
    </>
  )
}

export const Store = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { data } = useAppSelector(selectInfoStore)

  useEffect(() => {
    dispatch(getInfoStore())
  }, [dispatch])

  const stages = [
    {
      title: language['ORGANIZE'],
      path: '/organize',
    },
    {
      title: language['STORE'],
    },
  ]

  const handleEditStore = (id) => {
    navigate(`/organize/store/update/${id}`)
  }

  return (
    <Container header={<Header stages={stages} />}>
      <DetailStore id={data?._id} detail={data?.address} name={data?.name} icon={data?.logo?.filename} type={data?.type} onEdit={handleEditStore} />
      <StoreSummary storeId={data?._id} layout={{ floors: data?.floorCount, rooms: data?.roomCount, tables: data?.tableCount }} />
      <FeatureGate feature='tables'>
        <StructureContainer />
      </FeatureGate>
    </Container>
  )
}

export { UpdateStore } from './Update'
export { LayoutForm } from './LayoutForm'
