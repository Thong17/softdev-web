import useTheme from 'hooks/useTheme'
import {
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  forwardRef,
  ReactElement,
} from 'react'
import { CustomInput, CustomMiniInput } from 'styles'
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
      <div className="icon" style={{ zIndex: 10, cursor: 'pointer' }}>{icon}</div>
    </CustomInput>
  )
}

export const MiniInput: ForwardRefRenderFunction<HTMLInputElement, ITextInput> = (
  { label, err, hint, icon, ...props },
  ref
) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomMiniInput styled={theme} device={device} icon={icon}>
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
      <div className="icon" style={{ zIndex: 10, cursor: 'pointer' }}>{icon}</div>
    </CustomMiniInput>
  )
}

export const NanoInput: ForwardRefRenderFunction<HTMLInputElement, ITextInput> = (
  { width = 43, height = 27, icon, ...props }) => {
  const { theme } = useTheme()

  return (
    <>
      <input
        style={{
          width: width,
          padding: icon ? '5px 35px 5px 5px' :  5,
          height: height,
          outline: 'none',
          border: theme.border.quaternary,
          background: 'none',
          borderRadius: theme.radius.primary,
          color: theme.text.secondary,
          boxSizing: 'border-box'
        }}
        {...props}
      />
      {icon}
    </>
  )
}

export const Nano: ForwardRefRenderFunction<HTMLInputElement, ITextInput> = (
  { width = 37, height = 27, icon, ...props }, ref) => {
  const { theme } = useTheme()

  return (
    <>
      <input
        ref={ref}
        style={{
          width: width,
          padding: icon ? '5px 35px 5px 5px' :  5,
          height: height,
          outline: 'none',
          border: theme.border.quaternary,
          background: 'none',
          borderRadius: theme.radius.primary,
          color: theme.text.secondary,
          boxSizing: 'border-box'
        }}
        {...props}
      />
      {icon}
    </>
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

export const MiniDetail: ForwardRefRenderFunction<HTMLTextAreaElement, IDetailInput> = ({ label, err, hint, ...props }, ref) => {
  const { theme } = useTheme()
  const { device } = useWeb()

  return (
    <CustomMiniInput styled={theme} device={device} icon={undefined}>
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
    </CustomMiniInput>
  )
}

const TextField = forwardRef(Input)
const MiniTextField = forwardRef(MiniInput)
const NanoTextField = forwardRef(Nano)
const DetailField = forwardRef(Detail)
const MiniDetailField = forwardRef(MiniDetail)

export { TextField, DetailField, MiniTextField, NanoTextField, MiniDetailField }
