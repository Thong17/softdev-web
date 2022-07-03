import useTheme from 'hooks/useTheme'

export const TextTitle = ({ title }) => {
  const { theme } = useTheme()
  return (
    <h2
      style={{
        fontFamily: theme.font.family,
        fontWeight: theme.font.weight,
        textAlign: 'center',
        paddingTop: 20,
        color: theme.text.primary,
      }}
    >
      {title}
    </h2>
  )
}
