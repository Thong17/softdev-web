import useTheme from 'hooks/useTheme'

export const ColorPlate = ({ width = 15, height = 15, color }) => {
  const { theme } = useTheme()
  return (
    <span
      style={{
        width: width,
        height: height,
        borderRadius: theme.radius.circle,
        boxShadow: theme.shadow.inset,
        backgroundColor: color,
        display: 'block',
      }}
    ></span>
  )
}
