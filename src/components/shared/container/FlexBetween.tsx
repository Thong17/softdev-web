export const FlexBetween = ({ children, style = {} }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...style }}>{children}</div>
  )
}
