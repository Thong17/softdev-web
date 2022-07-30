import * as yup from 'yup'

export const storeSchema = yup.object().shape({
  name: yup.string().optional(),
  contact: yup.string().optional(),
  type: yup.string().optional(),
  font: yup.string().optional(),
  tax: yup.number().optional(),
  logo: yup.mixed().optional(),
  address: yup.string().optional(),
  other: yup.string().optional(),
})
