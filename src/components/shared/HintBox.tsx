import { CSSProperties, ReactNode } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import useTheme from 'hooks/useTheme'

// A tonal note box: tinted background, an icon at the top left and a thin
// accent line set in from the left edge.
//   <HintBox>Customers earn a tier from …</HintBox>
//   <HintBox color={theme.color.warning} icon={<WarningAmberRoundedIcon />}>…</HintBox>
export const HintBox = ({ children, color, icon, style }: {
  children: ReactNode
  // Accent colour; the info colour by default
  color?: string
  // Replaces the info icon; pass null for none
  icon?: ReactNode | null
  style?: CSSProperties
}) => {
  const { theme } = useTheme()
  const accent = color || theme.color.info
  const shownIcon = icon === undefined ? <InfoOutlinedIcon /> : icon

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '14px 16px 14px 26px',
        borderRadius: theme.radius.secondary,
        backgroundColor: `${accent}14`,
        color: theme.text.secondary,
        fontSize: 14,
        lineHeight: 1.7,
        ...style,
      }}
    >
      <span style={{ position: 'absolute', left: 10, top: 12, bottom: 12, width: 2, borderRadius: 2, backgroundColor: `${accent}99` }} />
      {shownIcon && (
        <span style={{ display: 'flex', color: accent, marginTop: 2, flexShrink: 0, fontSize: 20 }}>
          {shownIcon}
        </span>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>{children}</div>
    </div>
  )
}
