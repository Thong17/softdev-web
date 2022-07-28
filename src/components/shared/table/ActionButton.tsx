import { ButtonProps, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded'
import useTheme from 'hooks/useTheme'
import { FC } from 'react'

export const UpdateButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      {...prop}
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.info,
      }}
    >
      <Edit fontSize='small' />
    </IconButton>
  )
}

export const ConfirmButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      {...prop}
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.info,
      }}
    >
      <CheckRoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const StockButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      {...prop}
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.info,
      }}
    >
      <Inventory2RoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const DeleteButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      {...prop}
      size='small'
      style={{
        backgroundColor: `${theme.color.error}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.error,
      }}
    >
      <DeleteIcon fontSize='small' />
    </IconButton>
  )
}

export const RejectButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      {...prop}
      size='small'
      style={{
        backgroundColor: `${theme.color.error}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.error,
      }}
    >
      <CloseRoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const ViewButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <span style={{ color: theme.text.secondary }} {...prop}>
      <MoreVertRoundedIcon fontSize='small' />
    </span>
  )
}

export const DetailButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.info,
      }}
      {...prop}
    >
      <CenterFocusStrongRoundedIcon fontSize='small' />
    </IconButton>
  )
}
