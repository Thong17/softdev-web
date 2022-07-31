import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { FloorStructure, TableStructure } from 'components/shared/structure'
import { DetailStore } from 'components/shared/container/DetailStore'
import { DetailTitle } from 'components/shared/container/DetailTitle'
import Button from 'components/shared/Button'
import useTheme from 'hooks/useTheme'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getInfoStore, selectInfoStore } from './redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
    </>
  )
}

export const Store = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { theme } = useTheme()
  const { data } = useAppSelector(selectInfoStore)

  useEffect(() => {
    dispatch(getInfoStore())
  }, [dispatch])
  

  const stages = [
    {
      title: 'Organize',
      path: '/organize',
    },
    {
      title: 'Store',
    },
  ]

  const handleEditStore = (id) => {
    navigate(`/organize/store/update/${id}`)
  }

  return (
    <Container header={<Header stages={stages} />}>
      <DetailStore id={data?._id} detail={data?.address} name={data?.name} icon={data?.logo?.filename} type={data?.type} onEdit={handleEditStore}>
        <div style={{  }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <DetailTitle title='Floor' value={7} />
          <DetailTitle title='Room' value={13} />
          <DetailTitle title='Table' value={27} />
          </div>
          <Button fullWidth style={{ backgroundColor: theme.background.primary, color: theme.color.info }} onClick={() => navigate(`/organize/store/${data?._id}/structure`)}>Edit</Button>
        </div>
      </DetailStore>
      <FloorStructure
        gridArea={`
            'r1 r4 r5 r16 r17'
            's0 r4 s2 s10 s11'
            'r2 r8 r6 r12 r13'
            's1 r8 s3 s12 s13'
            'r3 r8 r7 r7 r7'
          `}
        gridColumn='1fr 1fr 1fr 1fr 1fr'
      >
        <div style={{ gridArea: 's0', height: 50, width: 100 }}></div>
        <div style={{ gridArea: 's1', height: 50, width: 100 }}></div>
        <div style={{ gridArea: 's2', height: 50, width: 100 }}></div>
        <div style={{ gridArea: 's3', height: 50, width: 100 }}></div>
        <TableStructure
          title='T1'
          description='Reserved 8:00PM'
          area='r1'
          justify='center'
          length={2}
          status='occupied'
        />
        <TableStructure
          title='T2'
          description='Reserved 8:00PM'
          area='r2'
          justify='center'
          length={2}
        />
        <TableStructure
          title='T3'
          description='Reserved 8:00PM'
          area='r3'
          length={2}
        />
        <TableStructure
          title='T4'
          description='Reserved 8:00PM'
          length={2}
          direction='column'
          area='r4'
          align='center'
          status='reserved'
        />
        <TableStructure
          title='T8'
          description='Reserved 8:00PM'
          length={3}
          direction='column'
          area='r8'
          align='center'
          status='reserved'
        />
        <TableStructure
          title='T5'
          description='Reserved 8:00PM'
          length={1}
          area='r5'
        />
        <TableStructure
          title='T6'
          description='Reserved 8:00PM'
          length={2}
          area='r6'
        />
        <TableStructure
          title='T6'
          description='Reserved 8:00PM'
          length={2}
          area='r12'
        />
        <TableStructure
          title='T6'
          description='Reserved 8:00PM'
          length={2}
          area='r13'
        />
        <TableStructure
          title='T6'
          description='Reserved 8:00PM'
          length={1}
          area='r16'
        />
        <TableStructure
          title='T6'
          description='Reserved 8:00PM'
          length={1}
          area='r17'
        />
        <TableStructure
          title='T7'
          description='Reserved 8:00PM'
          length={8}
          area='r7'
        />
      </FloorStructure>
    </Container>
  )
}

export { UpdateStore } from './Update'
export { StructureForm } from './StructureForm'
