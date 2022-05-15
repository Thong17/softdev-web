import useTheme from 'hooks/useTheme'
import { ForwardRefRenderFunction, InputHTMLAttributes } from 'react'
import { CustomInput } from 'styles'
import useWeb from 'hooks/useWeb'

interface ITextInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const TextInput: ForwardRefRenderFunction<HTMLInputElement, ITextInput> = ({ label, ...props }) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomInput styled={theme} device={device}>
      <input
        placeholder=' '
        autoComplete='new-password'
        {...props}
      />
      <label>{label}</label>
    </CustomInput>
  )
}

export default TextInput
