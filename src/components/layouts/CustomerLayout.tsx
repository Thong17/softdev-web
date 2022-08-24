import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef } from 'react'
import { CustomListContainer } from 'styles'
import { dateFormat } from 'utils'

const Item = (props, ref) => {
  const { name, phone, dateOfBirth, action } =
    props
  return (
    <div className='list-item' ref={ref}>
      <div className="content" style={{ display: 'flex', flexDirection: 'column', flex: '0 50%' }}>
        <span>{name}</span>
        <span className="detail">{phone}</span>
      </div>
      <div className="content" style={{ flex: '0 50%' }}>
        {dateFormat(dateOfBirth)} 
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
