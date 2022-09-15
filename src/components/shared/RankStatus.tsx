import useTheme from 'hooks/useTheme'

export const RankStatus = ({ text, color, size, label, margin }: any) => {
  const { theme } = useTheme()

  return (
    <div
      style={{
        padding: '1px 9px 1px 7px',
        color: color,
        backgroundColor: `${color}22`,
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        borderRadius: theme.radius.secondary,
        fontSize: size || 13,
        boxShadow: theme.shadow.inset,
        zIndex: 100,
        margin: margin
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          backgroundColor: color,
          borderRadius: theme.radius.circle,
          marginRight: 7,
        }}
      ></span>
      {label && <span>{label}</span>}
      <span>{text}</span>
    </div>
  )
}
