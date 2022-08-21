import useTheme from 'hooks/useTheme'

export const NotificationLabel = ({ value }) => {
  const { theme } = useTheme()
  return (
    <span
      style={{
        position: 'absolute',
        top: 7,
        right: 7,
        padding: '1px 4px',
        backgroundColor: `${theme.color.error}cc`,
        borderRadius: theme.radius.primary,
        display: 'gird',
        placeItems: 'center',
        fontSize: 11,
        color: theme.text.secondary
      }}
    >
      {value}
    </span>
  )
}
