import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'

export const TextLabel = ({ children, width, label }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <div
      style={{
        width,
        display: 'inline-block',
        position: 'relative',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '9.5px 10px 6px 10px',
        border: theme.border.quaternary,
        borderRadius: theme.radius.primary,
        margin: '0 5px'
      }}
    >
      {label && <span
        style={{
          position: 'absolute',
          top: -10,
          left: 5,
          backgroundColor: theme.active.primary,
          padding: '1px 8px 2px 8px',
          fontSize: theme.responsive[device]?.text.quaternary,
          borderRadius: theme.radius.primary,
          color: theme.text.secondary
        }}
      >
        {label}
      </span>}
      {children}
    </div>
  )
}
