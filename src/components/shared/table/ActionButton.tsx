import { ButtonProps, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import EscalatorRoundedIcon from '@mui/icons-material/EscalatorRounded'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
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

export const StockButton = ({ isStock, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      {...prop}
      size='small'
      style={{
        backgroundColor: isStock ? `${theme.color.info}22` : `${theme.color.error}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: isStock ? theme.color.info : theme.color.error,
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
    <IconButton 
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        marginLeft: 5,
        color: theme.color.info,
      }} 
      {...prop}>
      <MoreVertRoundedIcon fontSize='small' />
    </IconButton>
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
      <TrendingFlatRoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const ReportButton: FC<ButtonProps> = ({ ...prop }) => {
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
      <BarChartRoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const AddButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        color: theme.color.info,
        marginLeft: 0,
      }}
      {...prop}
    >
      <AddRoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const RemoveButton: FC<ButtonProps> = ({ ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${theme.color.error}33`,
        borderRadius: theme.radius.primary,
        color: theme.color.error,
        marginLeft: 2,
      }}
      {...prop}
    >
      <RemoveRoundedIcon fontSize='small' />
    </IconButton>
  )
}

export const MergeButton: FC<ButtonProps> = ({ disabled, title, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: disabled ? `${theme.text.secondary}22` : `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        color: disabled ? theme.text.secondary : theme.color.info,
      }}
      disabled={disabled}
      {...prop}
    >
      <InsertLinkRoundedIcon fontSize='small' />
      {title && <span style={{ marginLeft: 5, fontSize: 13 }}>{title}</span>}
    </IconButton>
  )
}

export const UploadButton: FC<ButtonProps> = ({ title, disabled, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: !disabled ? `${theme.text.secondary}22` : `${theme.color.success}22`,
        borderRadius: theme.radius.primary,
        color: !disabled ? theme.text.secondary : theme.color.success,
        marginLeft: 5,
      }}
      disabled={!disabled}
      {...prop}
    >
      <FileUploadRoundedIcon fontSize='small' />
      {title && <span style={{ marginLeft: 5, fontSize: 13 }}>{title}</span>}
    </IconButton>
  )
}

export const ResetButton: FC<ButtonProps> = ({ title, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${theme.color.error}33`,
        borderRadius: theme.radius.primary,
        color: theme.color.error,
        marginLeft: 5,
      }}
      {...prop}
    >
      <RestartAltRoundedIcon fontSize='small' />
      {title && <span style={{ marginLeft: 5, fontSize: 13 }}>{title}</span>}
    </IconButton>
  )
}

export const PrintButton: FC<ButtonProps> = ({ title, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${theme.color.info}33`,
        borderRadius: theme.radius.primary,
        color: theme.color.info,
        marginLeft: 5,
      }}
      {...prop}
    >
      <PrintRoundedIcon fontSize='small' />
      {title && <span style={{ marginLeft: 5, fontSize: 13 }}>{title}</span>}
    </IconButton>
  )
}

export const FloorButton: FC<ButtonProps> = ({ title, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${theme.color.info}22`,
        borderRadius: theme.radius.primary,
        color: theme.color.info,
        marginLeft: 5,
      }}
      {...prop}
    >
      <EscalatorRoundedIcon fontSize='small' />
      {title && <span style={{ marginLeft: 5, fontSize: 13 }}>{title}</span>}
    </IconButton>
  )
}

export const ToggleButton = ({ state, ...prop }) => {
  const { theme } = useTheme()
  return (
    <IconButton
      size='small'
      style={{
        backgroundColor: `${ state ? theme.color.error : theme.color.info}22`,
        borderRadius: theme.radius.primary,
        color: state ? theme.color.error : theme.color.info,
        marginRight: 5,
      }}
      {...prop}
    >
      <InsertLinkRoundedIcon fontSize='small' />
    </IconButton>
  )
}