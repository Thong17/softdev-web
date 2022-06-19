import { CustomTextEllipsis } from "styles"

export const TextEllipsis = ({ children, ...props }) => {
  return (
    <CustomTextEllipsis {...props}>{children}</CustomTextEllipsis>
  )
}
