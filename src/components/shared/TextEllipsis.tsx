import { CustomTextEllipsis } from "styles"

export const TextEllipsis = ({ children, title = '', ...props }) => {
  return (
    <CustomTextEllipsis title={title} {...props}>{children}</CustomTextEllipsis>
  )
}
