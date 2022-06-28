import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomListContainer } from 'styles'

export const ListItem = (props) => {
  const { picture, action, status, loading } =
    props
  return (
    <div className='list-item'>
      <div style={{ flex: '0 50px', display: 'flex', justifyContent: 'center' }}>
        <span className={`status ${status ? 'active' : 'inactive'}`} />
      </div>
      <div className={`img ${loading && 'skeleton'}`} style={{ flex: 'initial', padding: '0 10px' }}>
        {!loading && (
          <>
            <img
              src={`${process.env.REACT_APP_API_UPLOADS}${
                picture ? picture : 'default.jpg'
              }`}
              alt={picture}
            />
          </>
        )}
      </div>
      <div className="content" style={{ flex: '0 20%' }}>
        <span>Apple Mac book Pro 13 inches</span>
        <span>Category</span>
      </div>
      <div className="content" style={{ flex: '0 15%' }}>
        <span className='subject'>Category</span>
        <span>Laptop</span>
      </div>
      <div className="content" style={{ flex: '0 15%' }}>
        <span className='subject'>Brand</span>
        <span>Apple</span>
      </div>
      <div className="content" style={{ flex: '0 15%' }}>
        <span className='subject'>Stock</span>
        <span>100 Left</span>
      </div>
      <div className="content" style={{ flex: '0 15%' }}>
        <span className='price'>18$</span>
      </div>
      <div className='action' style={{ flex: '0 50px' }}>
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
