import useTheme from "hooks/useTheme"

export const CircleIcon = ({ icon }) => {
  const { theme } = useTheme()
  return (
    <div style={{ width: 30, height: 30, borderRadius: theme.radius.circle, overflow: 'hidden', border: theme.border.quaternary, padding: 3 }}>
      <img
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: theme.radius.circle }}
        src={`${process.env.REACT_APP_API_UPLOADS}${
          icon ? icon : 'default.jpg'
        }`}
        alt={icon}
      />
    </div>
  )
}