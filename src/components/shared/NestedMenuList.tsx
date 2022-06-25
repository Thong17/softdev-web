import useTheme from 'hooks/useTheme'
import { ReactElement } from 'react'
import { CustomNestedMenuList } from 'styles/menu'

export const NestedMenuList = ({ label, icon, children }: { label: string, icon?: ReactElement, children: any }) => {
  const { theme } = useTheme()
  return (
    <CustomNestedMenuList styled={theme}>
      <div className="label"><span>{label}</span>{icon}</div>
      <div className='nested-menu'>{children}</div>
    </CustomNestedMenuList>
  )
}
