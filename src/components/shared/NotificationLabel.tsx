import useTheme from 'hooks/useTheme'

export const NotificationLabel = ({ value, top= 7, right= 7, borderRadius= '5px' }) => {
  const { theme } = useTheme()
  return (
    <span
      style={{
        position: 'absolute',
        top: top,
        right: right,
        padding: '1px 4px',
        backgroundColor: `${theme.color.error}cc`,
        borderRadius: borderRadius,
        display: 'grid',
        placeItems: 'center',
        fontSize: 11,
        color: 'white'
      }}
    >
      {value}
    </span>
  )
}
