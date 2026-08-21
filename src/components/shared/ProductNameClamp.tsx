interface IProductNameClamp {
  children: string
}

export const ProductNameClamp = ({ children }: IProductNameClamp) => (
  <div
    title={children}
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
)
