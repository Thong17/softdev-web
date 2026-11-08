// Microsoft Excel style file icon: the green sheet with the white "X" badge
export const ExcelIcon = ({ size = 18, style }: { size?: number, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox='0 0 32 32' style={style} aria-hidden>
    {/* Sheet, with the darker bands of the real icon */}
    <path d='M10 3h17a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z' fill='#21A366' />
    <path d='M8 16h21v6H8z' fill='#107C41' />
    <path d='M18.5 3H27a2 2 0 0 1 2 2v5H18.5z' fill='#33C481' />
    <path d='M8 22h21v5a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z' fill='#185C37' />
    <path d='M18.5 10H29v6H18.5z' fill='#21A366' opacity='0.6' />
    {/* "X" badge */}
    <rect x='2' y='8' width='16' height='16' rx='2' fill='#107C41' />
    <path d='M5.6 12h2.6l1.8 3.1 1.9-3.1h2.5l-3.1 4.5 3.2 4.5h-2.6L10 17.8 8 21H5.4l3.2-4.5z' fill='#FFFFFF' />
  </svg>
)
