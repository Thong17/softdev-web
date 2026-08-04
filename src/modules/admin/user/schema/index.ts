import * as yup from 'yup'

export const createUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
  email: yup.string().email().required(),
  role: yup.string().required(),
  expireAt: yup.date().nullable().default(undefined)
    .transform((curr, orig) => orig === '' ? null : curr)
    .typeError('Invalid Date'),
})

export const updateUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().optional(),
  email: yup.string().email().required(),
  role: yup.string().required(),
  expireAt: yup.date().nullable().default(undefined)
    .transform((curr, orig) => orig === '' ? null : curr)
    .typeError('Invalid Date'),
})