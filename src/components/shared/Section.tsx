import useTheme from 'hooks/useTheme'

export const Section = ({ children, describe, boxShadow, err, ...props }: any) => {
  const { theme } = useTheme()
  return (
    <div {...props}>
      <div
        style={{
          padding: 20,
          border: err ? `1px solid ${theme.color.error}77` : theme.border.quaternary,
          borderRadius: theme.radius.ternary,
          position: 'relative',
          boxShadow: boxShadow || ''
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: -12,
            backgroundColor: theme.background.primary,
            color: err ? theme.color.error : theme.text.secondary,
            padding: '0 5px',
          }}
        >
          {describe}
        </span>
        {children}
      </div>
    </div>
  )
}
