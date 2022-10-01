import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required()
})

export const registerSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  confirm_password: yup.string().oneOf([yup.ref('password')], 'Confirm password does not match').required(),
  email: yup.string().email().required(),
  role: yup.string().required()
})

export const updateProfileSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string(),
  birthday: yup.mixed(),
  contact: yup.string(),
  address: yup.string(),
  gender: yup.string(),
})

export const changePasswordSchema = yup.object().shape({
  current_password: yup.string().required(),
  new_password: yup.string().required(),
  confirm_password: yup.string().oneOf([yup.ref('new_password')], 'Confirm password does not match').required(),
})