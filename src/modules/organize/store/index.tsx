import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { FloorStructure, TableStructure } from 'components/shared/structure'
import { DetailStore } from 'components/shared/container/DetailStore'
import { DetailTitle } from 'components/shared/container/DetailTitle'
import Button from 'components/shared/Button'
import useTheme from 'hooks/useTheme'

const Header = ({ stages }) => {
  return (
    <>
      <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
    </>
  )
}

export const Store = () => {
  const { theme } = useTheme()
  const stages = [
    {
      title: 'Organize',
      path: '/organize',
    },
    {
      title: 'Store',
    },
  ]

  return (
    <Container header={<Header stages={stages} />}>
      <DetailStore detail='#30, St. 5, Borey Piphub Thmey Chhuk Va 3' name='SoftDev' icon={null} type='Restaurant'>
        <div style={{  }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <DetailTitle title='Floor' value={7} />
          <DetailTitle title='Room' value={13} />
          <DetailTitle title='Table' value={27} />
          </div>
          <Button fullWidth style={{ backgroundColor: theme.background.primary, color: theme.color.info }}>Edit</Button>
        </div>
      </DetailStore>
      <br />
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
      <FloorStructure
      floor='1F'
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
      <FloorStructure
      floor='2F'
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
