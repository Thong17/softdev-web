import * as yup from 'yup'

export const writeOffSchema = yup.object().shape({
  writeOffType: yup.number().required(),
  currency: yup.string().required(),
  cost: yup.number().required(),
  condition: yup.string().optional(),
})
