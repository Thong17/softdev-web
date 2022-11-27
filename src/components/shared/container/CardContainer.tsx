import useTheme from "hooks/useTheme"
import useWeb from "hooks/useWeb"
import { TextEllipsis } from "../TextEllipsis"

export const CardContainer = ({ title, children, ...props }) => {
    const { theme } = useTheme()
    const { device } = useWeb()
  return (
    <div {...props}>
        <div
            style={{
                background: `${theme.background.secondary}cc`,
                borderRadius: theme.radius.secondary,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: theme.shadow.container,
                padding: '0 5px 5px 5px',
                boxSizing: 'border-box'
            }}
        >
            <TextEllipsis style={{ textAlign: 'start', fontSize: theme.responsive[device]?.text.h3, padding: 10, boxSizing: 'border-box' }}>{title}</TextEllipsis>
            <div style={{ backgroundColor: theme.background.primary, borderRadius: theme.radius.secondary, display: 'flex', width: '100%' }}>
                {children}
            </div>
        </div>
    </div>
  )
}
