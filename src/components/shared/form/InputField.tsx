import useTheme from 'hooks/useTheme'
import {
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  forwardRef,
  ReactElement,
} from 'react'
import { CustomInput } from 'styles'
import useWeb from 'hooks/useWeb'

interface ITextInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  err?: string
  hint?: string
  icon?: ReactElement
}

interface IDetailInput extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  err?: string
  hint?: string
}

export const Input: ForwardRefRenderFunction<HTMLInputElement, ITextInput> = (
  { label, err, hint, icon, ...props },
  ref
) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomInput styled={theme} device={device} icon={icon}>
      <input
        ref={ref}
        placeholder=' '
        autoComplete='new-password'
        className={err && 'input-error'}
        {...props}
      />
      <label>{label}</label>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
      <div className="icon">{icon}</div>
    </CustomInput>
  )
}

export const Detail: ForwardRefRenderFunction<HTMLTextAreaElement, IDetailInput> = ({ label, err, hint, ...props }, ref) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomInput styled={theme} device={device} icon={undefined}>
      <textarea
        ref={ref}
        placeholder=' '
        autoComplete='new-password'
        className={err && 'input-error'}
        {...props}
      ></textarea>
      <label>{label}</label>
      <div className='err'>{err}</div>
      <div className='hint'>{hint}</div>
    </CustomInput>
  )
}

const TextField = forwardRef(Input)
const DetailField = forwardRef(Detail)

export { TextField, DetailField }
