import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomGridContainer } from 'styles'

export const GridItem = (props) => {
  const { title, picture, subLeft, subRight, action, status } =
    props

  return (
    <div className='grid-item'>
      <div className='img'>
        <>
          <div className='action'>
            {action}
          </div>
          <div className={`status ${status ? 'active' : 'inactive'}`}></div>
          <img
            src={`${process.env.REACT_APP_API_UPLOADS}${
              picture ? picture : 'default.jpg'
            }`}
            alt={picture}
          />
        </>
      </div>
      <div className='content'>
        <div className='title' title={title}>
          <span>{title}</span>
        </div>
        <div className='sub-title'>
          <div className='sub-left'>
            {subLeft}
          </div>
          <div className='sub-right'>
            {subRight}
          </div>
        </div>
      </div>
    </div>
  )
}

export const GridLayout = ({
  children
}) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomGridContainer styled={theme} device={device}>
      {children}
    </CustomGridContainer>
  )
}
