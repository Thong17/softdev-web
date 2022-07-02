import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomListContainer } from 'styles'

export const ListItem = (props) => {
  const { picture, title, first, second, third, fourth, action, status } =
    props
  return (
    <div className='list-item'>
      <div style={{ flex: '0 50px', display: 'flex', justifyContent: 'center' }}>
        <span className={`status ${status ? 'active' : 'inactive'}`} />
      </div>
      <div className='img' style={{ flex: 'initial', padding: '0 10px' }}>
        <img
          src={`${process.env.REACT_APP_API_UPLOADS}${
            picture ? picture : 'default.jpg'
          }`}
          alt={picture}
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

export const ListLayout = ({
  isLoading,
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
