import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import { CustomEditorInput } from 'styles'

export const EditorField = () => {
  const { theme } = useTheme()
  const { device } = useWeb()


  return (
    <CustomEditorInput styled={theme} device={device} active=''>
      Editor
    </CustomEditorInput>
  )
}
