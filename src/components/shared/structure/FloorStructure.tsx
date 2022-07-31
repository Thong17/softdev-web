import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'

export const FloorStructure = ({ children, gridColumn, gridArea, floor = 'GF' }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <div style={{ position: 'relative', padding: '0 0 0 30px', boxShadow: theme.shadow.primary, borderRadius: theme.radius.primary, overflow: 'hidden', marginBottom: 30, overflowX: 'auto' }}>
      <span
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: '0 0',
          position: 'absolute',
          color: theme.text.quaternary,
          fontSize: theme.responsive[device]?.text.h1,
          top: -20,
          left: 30,
          backgroundColor: theme.background.secondary,
          right: 0,
          paddingLeft: 30
        }}
      >
        {floor}
      </span>
      <div
        style={{
          position: 'relative',
          boxSizing: 'border-box',
          padding: '50px 0',
          display: 'grid',
          gridTemplateColumns: gridColumn,
          gridTemplateAreas: gridArea,
          gridGap: 20
        }}
      >
        {children}
      </div>
    </div>
  )
}
