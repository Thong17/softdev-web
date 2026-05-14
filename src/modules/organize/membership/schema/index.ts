import * as yup from 'yup'

export const membershipSchema = yup.object().shape({
  name: yup.object().required(),
  description: yup.object(),
  discount: yup.object().shape({
    value: yup.number().required().positive(),
    type: yup.string().required(),
    isFixed: yup.boolean()
  }),
  target: yup.object().shape({
    type: yup.string().required(),
    products: yup.array().optional(),
    categories: yup.array().optional(),
    brands: yup.array().optional()
  }),
  duration: yup.object().shape({
    value: yup.number().required().positive(),
    unit: yup.string().required()
  }),
  note: yup.string().optional(),
  startAt: yup.date().required(),
  expireAt: yup.date().required()
})