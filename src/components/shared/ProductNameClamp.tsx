import { Tooltip } from '@mui/material'

interface IProductNameClamp {
  children: string
}

export const ProductNameClamp = ({ children }: IProductNameClamp) => (
  <Tooltip title={children}>
    <div
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: 14,
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  </Tooltip>
)
