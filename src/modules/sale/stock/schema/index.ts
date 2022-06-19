import * as yup from 'yup'

export const stockSchema = yup.object().shape({
  cost: yup.number().required(),
  currency: yup.string().required(),
  quantity: yup.number().required(),
  code: yup.string().optional(),
  expireAt: yup.date().optional(),
  alertAt: yup.number().optional(),
  color: yup.string().optional(),
  options: yup.array().optional(),
})
