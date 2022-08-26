import useTheme from 'hooks/useTheme'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { IconButton } from '@mui/material'

export const DialogTitle = ({ title, onClose }) => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        padding: '5px 5px 5px 15px',
        backgroundColor: theme.background.secondary,
        borderRadius: theme.radius.ternary,
        color: theme.text.primary,
        margin: 10
      }}
    >
      <FlexBetween>
        <h2
          style={{
            fontFamily: theme.font.family,
            fontWeight: theme.font.weight,
          }}
        >
          {title}
        </h2>
        <IconButton onClick={() => onClose()}><CloseRoundedIcon style={{ color: theme.text.primary }} /></IconButton>
      </FlexBetween>
    </div>
  )
}
