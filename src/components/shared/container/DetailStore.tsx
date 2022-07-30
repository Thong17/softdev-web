import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import Button from '../Button'
import { TextEllipsis } from '../TextEllipsis'

export const DetailStore = ({ name, detail, type, icon, children }) => {
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
        boxShadow: theme.shadow.primary,
        padding: 5,
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        minWidth: 370,
        marginRight: 5,
        backgroundColor: theme.background.primary,
        padding: 5,
        borderRadius: theme.radius.primary,
      }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <div
            style={{
              minWidth: 70,
              minHeight: 70,
              width: 70,
              height: 70,
              borderRadius: theme.radius.circle,
              overflow: 'hidden',
              marginRight: 10,
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
                icon ? icon : 'default.png'
              }`}
              alt={icon}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              justifyContent: 'start',
            }}
          >
            <TextEllipsis
              style={{
                fontSize: theme.responsive[device]?.text.primary,
              }}
            >
              {name}
            </TextEllipsis>
            <TextEllipsis
              style={{
                fontSize: theme.responsive[device]?.text.quaternary,
                color: theme.text.secondary,
              }}
            >
              {detail}
            </TextEllipsis>
            <div style={{ marginTop: 10 }}>
              <TextEllipsis
                style={{
                  fontSize: theme.responsive[device]?.text.quaternary,
                  color: theme.text.tertiary,
                }}
              >
                {type}
              </TextEllipsis>
            </div>
          </div>
        </div>
        <Button fullWidth style={{ backgroundColor: theme.background.secondary, color: theme.color.info }}>Edit</Button>
      </div>
      <div style={{ width: '100%', height: '100%' }}>{children}</div>
    </div>
  )
}
