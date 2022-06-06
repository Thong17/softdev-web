import * as yup from 'yup'

export const createUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required()
})

export const updateUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().optional(),
  email: yup.string().email().required(),
  role: yup.string().required()
})