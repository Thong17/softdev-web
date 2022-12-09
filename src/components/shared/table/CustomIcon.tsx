import useTheme from 'hooks/useTheme'
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'

export const CircleIcon = ({ icon, star = false, master = false, color = '#FFD700', height = 30, width = 30 }) => {
  const { theme } = useTheme()
  return (
    <div style={{ position: 'relative', width: 'fit-content' }}>
      {star && (
        <MilitaryTechRoundedIcon
          style={{ color: color, position: 'absolute', top: -3, right: -7 }}
        />
      )}
      {master && (
        <SchoolRoundedIcon
          style={{ color: color, position: 'absolute', top: -10, right: 0 }}
        />
      )}
      <div
        style={{
          minWidth: width,
          minHeight: height,
          width: height,
          height: width,
          borderRadius: theme.radius.circle,
          overflow: 'hidden',
          border: star || master ? `1px solid ${color}99` : theme.border.tertiary,
          padding: 3,
        }}
      >
        <img
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: theme.radius.circle,
          }}
          src={`${process.env.REACT_APP_API_UPLOADS}${
            icon ? icon : 'default.png'
          }`}
          alt={icon}
          loading='lazy'
        />
      </div>
    </div>
  )
}
