import useTheme from 'hooks/useTheme'
import {
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  forwardRef,
} from 'react'
import { CustomInput } from 'styles'
import useWeb from 'hooks/useWeb'

interface ITextInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  err?: string
}

export const Input: ForwardRefRenderFunction<HTMLInputElement, ITextInput> = (
  { label, err, ...props },
  ref
) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomInput styled={theme} device={device}>
      <input
        ref={ref}
        placeholder=' '
        autoComplete='new-password'
        className={err && 'input-error'}
        {...props}
      />
      <label>{label}</label>
      <div className='err'>{err}</div>
    </CustomInput>
  )
}

const TextInput = forwardRef(Input)

export { TextInput }
