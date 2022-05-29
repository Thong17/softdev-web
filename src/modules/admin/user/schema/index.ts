import * as yup from 'yup'

export const userSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required()
})
