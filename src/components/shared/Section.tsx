import useTheme from 'hooks/useTheme'

export const Section = ({ children, describe }) => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        padding: 20,
        border: theme.border.quaternary,
        borderRadius: theme.radius.secondary,
        margin: '20px 0',
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -12,
          backgroundColor: theme.background.primary,
          padding: '0 5px',
        }}
      >
        {describe}
      </span>
      {children}
    </div>
  )
}
