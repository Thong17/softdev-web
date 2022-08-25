import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef } from 'react'
import { CustomListContainer } from 'styles'
import { dateFormat } from 'utils'
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import CakeRoundedIcon from '@mui/icons-material/CakeRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { TextEllipsis } from 'components/shared/TextEllipsis'

const Item = (props, ref) => {
  const { name, phone, dateOfBirth, address, picture, onClick, action } =
    props
  
  return (
    <div className='list-item' ref={ref} onClick={() => onClick()}>
      <div style={{ marginLeft: 10 }}><CircleIcon icon={picture} /></div>
      <div className='content' style={{ display: 'flex', flexDirection: 'column', flex: '0 100%', marginRight: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextEllipsis>{name}</TextEllipsis>
          <span className="detail" style={{ display: 'flex', alignItems: 'center' }}><LocalPhoneRoundedIcon style={{ fontSize: 15, marginRight: 5 }} /><TextEllipsis>{phone}</TextEllipsis></span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="detail" style={{ display: 'flex', alignItems: 'end' }}><LocationOnRoundedIcon style={{ fontSize: 16, marginRight: 5 }} /><TextEllipsis>{address}</TextEllipsis></div>
          <div className="detail" style={{ display: 'flex', alignItems: 'end' }}><CakeRoundedIcon style={{ fontSize: 18, marginRight: 5 }} /><TextEllipsis>{dateFormat(dateOfBirth)}</TextEllipsis></div>
        </div>
      </div>
      <div className='action' style={{ position: 'absolute', right: 20 }}>
        {action}
      </div>
    </div>
  )
}

const CustomerItem = forwardRef(Item)

export { CustomerItem }

export const CustomerLayout = ({
  isLoading = false,
  children
}) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomListContainer
      loading={isLoading ? 'loading' : 'complete'}
      styled={theme}
      device={device}
    >
      {children}
    </CustomListContainer>
  )
}
