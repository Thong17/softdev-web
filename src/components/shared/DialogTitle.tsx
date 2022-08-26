import useTheme from 'hooks/useTheme'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const DialogTitle = ({ title, onClose }) => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        padding: '10px 15px',
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
        <CloseRoundedIcon style={{ cursor: 'pointer' }} onClick={() => onClose()} />
      </FlexBetween>
    </div>
  )
}
