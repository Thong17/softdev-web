import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required()
})

export const registerSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  confirm_password: yup.string().oneOf([yup.ref('password')], 'Confirm password does not match'),
  email: yup.string().email(),
  role: yup.string().required()
})