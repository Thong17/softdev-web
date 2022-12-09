import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef } from 'react'
import { CustomListContainer } from 'styles'

const Item = (props, ref) => {
  const { picture, title, first, second, third, fourth, onClick, action, display, status } =
    props
  return (
    <div style={{ display: display ? display === 'block' ? 'flex' : 'none' : 'flex' }} className='list-item' onClick={() => onClick()} ref={ref}>
      <div style={{ flex: '0 50px', display: 'flex', justifyContent: 'center' }}>
        <span className={`status ${status ? 'active' : 'inactive'}`} />
      </div>
      <div className='img' style={{ flex: 'initial', padding: '0 10px' }}>
        <img
          src={`${process.env.REACT_APP_API_UPLOADS}${
            picture ? picture : 'default.png'
          }`}
          alt={picture}
          loading='lazy'
        />
      </div>
      <div className="content" style={{ flex: '0 30%' }}>
        {title}
      </div>
      <div className="content" style={{ flex: '0 15%' }}>
        {first}
      </div>
      <div className="content" style={{ flex: '0 15%' }}>
        {second}
      </div>
      <div className="content" style={{ flex: '0 10%' }}>
        {third} 
      </div>
      <div className="content" style={{ flex: '0 20%' }}>
        {fourth}
      </div>
      <div className='action' style={{ position: 'absolute', right: 20 }}>
        {action}
      </div>
    </div>
  )
}

const ListItem = forwardRef(Item)

export { ListItem }

export const ListLayout = ({
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
