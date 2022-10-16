import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { DetailStore } from 'components/shared/container/DetailStore'
import { DetailTitle } from 'components/shared/container/DetailTitle'
import Button from 'components/shared/Button'
import useTheme from 'hooks/useTheme'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getInfoStore, selectInfoStore } from './redux'
import { useNavigate } from 'react-router-dom'
import { StructureContainer } from 'components/shared/container/StructureContainer'
import { useEffect } from 'react'
import useLanguage from 'hooks/useLanguage'

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
  const { theme } = useTheme()
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
      <DetailStore id={data?._id} detail={data?.address} name={data?.name} icon={data?.logo?.filename} type={data?.type} onEdit={handleEditStore}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <DetailTitle title='Floor' value={7} />
          <DetailTitle title='Room' value={13} />
          <DetailTitle title='Table' value={27} />
          </div>
          <Button fullWidth style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }} onClick={() => navigate(`/organize/store/${data?._id}/layout`)}>{language['EDIT']}</Button>
        </div>
      </DetailStore>
      <StructureContainer />
    </Container>
  )
}

export { UpdateStore } from './Update'
export { LayoutForm } from './LayoutForm'
