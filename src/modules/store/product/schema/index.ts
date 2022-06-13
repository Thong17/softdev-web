import * as yup from 'yup'

export const productSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  status: yup.boolean().optional(),
  profile: yup.string().optional(),
  description: yup.string().optional(),
  price: yup.number().required(),
  currency: yup.string().required(),
  code: yup.string().optional(),
  isStock: yup.boolean().required(),
  images: yup.array().optional(),
  brand: yup.string().required(),
  category: yup.string().required(),
})

export const propertySchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  description: yup.string().optional(),
})

export const optionSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  price: yup.number().optional(),
  currency: yup.string().optional(),
  profile: yup.string().optional().nullable(),
  description: yup.string().optional(),
})
