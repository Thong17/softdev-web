import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import Button from '../Button'
import { TextEllipsis } from '../TextEllipsis'

export const DetailStore = ({
  id,
  name,
  detail,
  type,
  icon,
  onEdit,
  children,
}) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  const { language } = useLanguage()

  return (
    <div
      style={{
        borderRadius: theme.radius.secondary,
        position: 'relative',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'end',
        boxSizing: 'border-box',
        marginBottom: 20,
      }}
    >
      <div style={{ padding: 10, boxShadow: theme.shadow.primary, borderRadius: theme.radius.primary }}>
        <div
          style={{
            minWidth: 370,
            backgroundColor: theme.background.primary,
            borderRadius: theme.radius.primary,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 10,
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
                loading='lazy'
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
        </div>
        <Button
          fullWidth
          onClick={() => onEdit(id)}
          style={{
            color: theme.color.info,
            backgroundColor: `${theme.color.info}22`
          }}
        >
          {language['EDIT']}
        </Button>
      </div>
      <div style={{ width: '100%', height: '100%', marginLeft: 20, padding: 10, boxShadow: theme.shadow.primary, borderRadius: theme.radius.primary }}>{children}</div>
    </div>
  )
}
