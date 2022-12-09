import { TextEllipsis } from 'components/shared/TextEllipsis'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef, useState } from 'react'
import { CustomGridContainer } from 'styles'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import { PromotionTag } from 'components/shared/PromotionTag'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAuth from 'hooks/useAuth'
import { CircularProgress } from '@mui/material'
import { compareDate } from 'utils/index'
import { ExpirationTag } from 'components/shared/ExpirationTag'

const Item = (props, ref) => {
  const {
    id,
    title,
    picture,
    subLeft,
    subRight,
    action,
    status,
    display,
    selected,
    promotion,
    favorite,
    active,
    expireAt,
    ...prop
  } = props
  const { notify } = useNotify()
  const { reload } = useAuth()
  const [loading, setLoading] = useState(false)

  const addFavorite = (event) => {
    setLoading(true)
    Axios({
      url: `/user/product/${id}/favorite/add`,
      method: 'PUT',
    }).then(() => {
      reload()
    }).catch(err => {
      notify(err?.response?.data?.msg, 'error')
    }).finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    })
    event.stopPropagation()
  }

  const removeFavorite = (event) => {
    setLoading(true)
    Axios({
      url: `/user/product/${id}/favorite/remove`,
      method: 'PUT',
    }).then(() => {
      reload()
    }).catch(err => {
      notify(err?.response?.data?.msg, 'error')
    }).finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 200)
    })
    event.stopPropagation()
  }

  return (
    <div
      className='grid-item'
      ref={ref}
      style={{ display: display || 'block' }}
    >
      <div
        className={ selected !== undefined ? 'img active' : active !== undefined ? 'img active' : 'img'}
        {...prop}
      >
        {selected && (
          <div className='selected'>
            <DoneAllRoundedIcon />
          </div>
        )}
        {active && (
          <div className='selected'>
            <DoneAllRoundedIcon />
          </div>
        )}
        {action && <div className='action'>{action}</div>}
        {promotion && !compareDate(Date.now(), new Date(promotion.expireAt)) && <PromotionTag data={promotion} />}
        {(expireAt && expireAt < 10) && <ExpirationTag value={expireAt.toFixed(0)} />}
        {favorite !== undefined && (
          <>
            {favorite ? (
              <div className='favorite' onClick={removeFavorite}>
                {loading ? <CircularProgress style={{ width: 13, height: 13, position: 'absolute' }} /> : <BookmarkRoundedIcon className='active' />}
              </div>
            ) : (
              <div className='favorite' onClick={addFavorite}>
                {loading ? <CircularProgress style={{ width: 13, height: 13, position: 'absolute' }} />: <BookmarkBorderRoundedIcon />}
              </div>
            )}
          </>
        )}
        {status !== undefined && (
          <div className={`status ${status ? 'active' : 'inactive'}`}></div>
        )}
        <img
          src={`${process.env.REACT_APP_API_UPLOADS}${
            picture ? picture : 'default.png'
          }`}
          alt={picture}
          loading='lazy'
        />
      </div>
      <div className='content'>
        <div className='title'>
          <TextEllipsis title={title}>{title}</TextEllipsis>
        </div>
        <div className='sub-title'>
          <TextEllipsis className='sub-left'>{subLeft}</TextEllipsis>
          <TextEllipsis className='sub-right'>{subRight}</TextEllipsis>
        </div>
      </div>
    </div>
  )
}

const GridItem = forwardRef(Item)

export { GridItem }

export const GridLayout = ({ children }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomGridContainer styled={theme} device={device}>
      {children}
    </CustomGridContainer>
  )
}
