import useTheme from 'hooks/useTheme'

export const FillBarChart = ({ percent = '30%', color = '#ffffff', title = 'Title', limit = 10 }) => {
    const { theme } = useTheme()
  return (
    <div style={{ width: '100%', padding: '10px 10px', boxSizing: 'border-box', position: 'relative' }}>
        <span style={{ position: 'absolute', top: -1, left: 18, fontSize: 10, letterSpacing: 0.2, color: theme.text.tertiary }}>{title}</span>
        <span style={{ position: 'absolute', top: -1, right: 16, fontSize: 10, letterSpacing: 0.2, color: theme.text.tertiary }}>{limit}</span>
        <span style={{ height: 16, width: '100%', display: 'flex', alignItems: 'center', padding: '0 4px', backgroundColor: theme.background.primary, borderRadius: theme.radius.secondary, boxSizing: 'border-box' }}>
            <span style={{ height: 8, display: 'block', width: percent, backgroundColor: color, borderRadius: theme.radius.primary }}></span>
        </span>
    </div>
  )
}
