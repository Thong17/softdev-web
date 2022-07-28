import { TextEllipsis } from 'components/shared/TextEllipsis'
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
              picture ? picture : 'default.png'
            }`}
            alt={picture}
          />
        </>
      </div>
      <div className='content'>
        <div className='title' title={title}>
          <TextEllipsis>{title}</TextEllipsis>
        </div>
        <div className='sub-title'>
          <TextEllipsis className='sub-left'>
            {subLeft}
          </TextEllipsis>
          <TextEllipsis className='sub-right'>
            {subRight}
          </TextEllipsis>
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
