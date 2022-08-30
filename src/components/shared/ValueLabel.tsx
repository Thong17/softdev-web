import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'

export const ValueLabel = ({ value, label, icon }: any) => {
  const { theme } = useTheme()
  const { device } = useWeb()
  return (
    <div style={{ display: 'flex', alignItems: 'end' }}>
      {icon ? (
        icon
      ) : (
        <span
          style={{
            color: theme.text.quaternary,
            fontSize: theme.responsive[device]?.text.quaternary,
            marginRight: 5,
          }}
        >
          {label}
        </span>
      )}
      <span style={{ lineHeight: 1 }}>{value}</span>
    </div>
  )
}
