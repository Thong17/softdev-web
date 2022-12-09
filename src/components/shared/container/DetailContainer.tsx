import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { TextEllipsis } from '../TextEllipsis'

export const DetailContainer = ({ username, profile, position, id, children }) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <div
      style={{
        background: theme.background.secondary,
        borderRadius: theme.radius.secondary,
        position: 'relative',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'end',
        boxShadow: theme.shadow.container,
        padding: 5,
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: theme.background.primary,
          padding: 5,
          borderRadius: theme.radius.primary,
          marginRight: 5
        }}
      >
        <div
          style={{
            minWidth: 130,
            minHeight: 130,
            width: 130,
            height: 130,
            borderRadius: theme.radius.primary,
            overflow: 'hidden',
          }}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: theme.radius.primary,
            }}
            src={`${process.env.REACT_APP_API_UPLOADS}${
              profile ? profile : 'default.png'
            }`}
            alt={profile}
            loading='lazy'
          />
        </div>
        <TextEllipsis
          style={{
            marginTop: 5,
            textAlign: 'center',
            fontSize: theme.responsive[device]?.text.primary,
          }}
        >
          {username}
        </TextEllipsis>
        <TextEllipsis
          style={{
            textAlign: 'center',
            fontSize: theme.responsive[device]?.text.quaternary,
            color: theme.text.secondary
          }}
        >
          {id}
        </TextEllipsis>
        <TextEllipsis
          style={{
            marginTop: 10,
            textAlign: 'center',
            fontSize: theme.responsive[device]?.text.quaternary,
            color: theme.text.tertiary
          }}
        >
          {position}
        </TextEllipsis>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
          {children}
      </div>
    </div>
  )
}
