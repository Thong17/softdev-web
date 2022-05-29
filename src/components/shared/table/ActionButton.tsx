import { ButtonProps, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import useTheme from 'hooks/useTheme'
import { FC } from 'react';

export const UpdateButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      { ...prop }
      size='small'
      style={{ backgroundColor: `${theme.color.info}22`, borderRadius: theme.radius.primary, marginLeft: 5, color: theme.color.info }}>
      <Edit fontSize='small' />
    </IconButton>
  )
}

export const DeleteButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      { ...prop }
      size='small'
      style={{ backgroundColor: `${theme.color.error}22`, borderRadius: theme.radius.primary, marginLeft: 5, color: theme.color.error }}>
      <DeleteIcon fontSize='small' />
    </IconButton>
  )
}

export const ViewButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      { ...prop }
      size='small'
      style={{ borderRadius: theme.radius.primary, marginLeft: 5, color: theme.text.tertiary }}>
      <MoreVertRoundedIcon fontSize='small' />
    </IconButton>
  )
}
