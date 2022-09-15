import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { forwardRef } from 'react'
import { CustomListContainer } from 'styles'
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { TextEllipsis } from 'components/shared/TextEllipsis'
import Edit from '@mui/icons-material/Edit'
import { IconButton } from '@mui/material'
import { RankStatus } from 'components/shared/RankStatus'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'

const Item = ({ id, name, contact, address, picture, point, onClick, onEdit, onDelete, display }, ref) => {
  const { theme } = useTheme()

  const handleEdit = (event) => {
    event.stopPropagation()
    onEdit(id)
  }

  const handleDelete = (event) => {
    event.stopPropagation()
    onDelete(id)
  }
  
  return (
    <div className='list-item' ref={ref} onClick={() => onClick()} style={{ display: display || 'flex' }}>
      <div style={{ marginLeft: 10 }}><CircleIcon icon={picture} /></div>
      <div className='content' style={{ display: 'flex', flexDirection: 'column', flex: '0 100%', marginRight: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <TextEllipsis>{name}</TextEllipsis>
            <RankStatus margin='0 0 0 5px' text={typeof point === 'string' ? parseInt(point) : point.toFixed(0)} color={theme.color.info} />
          </div>
          {contact&&<span className="detail" style={{ display: 'flex', alignItems: 'center' }}><LocalPhoneRoundedIcon style={{ fontSize: 15, marginRight: 5 }} /><TextEllipsis>{contact}</TextEllipsis></span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="detail" style={{ display: 'flex', alignItems: 'end' }}><LocationOnRoundedIcon style={{ fontSize: 16, marginRight: 5 }} /><TextEllipsis>{address}</TextEllipsis></div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={handleEdit}
          sx={{
            width: 30,
            height: 30,
            color: `${theme.color.info}cc`,
            '&:hover': { color: theme.color.info },
          }}
        >
          <Edit style={{ fontSize: 17 }} />
        </IconButton>
        <IconButton
          onClick={handleDelete}
          sx={{
            width: 30,
            height: 30,
            color: `${theme.color.error}cc`,
            '&:hover': { color: theme.color.error },
          }}
        >
          <DeleteRoundedIcon style={{ fontSize: 19 }} />
        </IconButton>
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
