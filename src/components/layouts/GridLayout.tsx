import { TextEllipsis } from 'components/shared/TextEllipsis'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef } from 'react'
import { CustomGridContainer } from 'styles'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import { PromotionTag } from 'components/shared/PromotionTag'

const Item = (props, ref) => {
  const { title, picture, subLeft, subRight, action, status, display, selected, promotion, favorite, ...prop } =
    props

  return (
    <div className='grid-item' ref={ref} style={{ display: display || 'block' }}>
      <div className='img' style={{ cursor: selected !== undefined ? 'pointer' : 'default' }} {...prop}>
        {selected && <div className='selected'><DoneAllRoundedIcon /></div>}
        <div className='action'>
          {action}
        </div>
        { promotion && <PromotionTag data={promotion} /> }
        { favorite && <div className='favorite'><BookmarkRoundedIcon /></div> }
        { status !== undefined && <div className={`status ${status ? 'active' : 'inactive'}`}></div> }
        <img
          src={`${process.env.REACT_APP_API_UPLOADS}${
            picture ? picture : 'default.png'
          }`}
          alt={picture}
        />
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

const GridItem = forwardRef(Item)

export { GridItem }

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
