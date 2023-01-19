import * as yup from 'yup'

export const promotionSchema = yup.object().shape({
  description: yup.object(),
  value: yup.number().required(),
  type: yup.string().required(),
  startAt: yup.date().required(),
  expireAt: yup.date().required(),
  isFixed: yup.boolean()
})
