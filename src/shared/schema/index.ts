import * as yup from 'yup'

export const transactionSchema = yup.object().shape({
  id: yup.string().required(),
  description: yup.string().required(),
  price: yup.object({
    value: yup.number().required('Price is required'),
    currency: yup.string().required('Currency is required'),
  }),
  quantity: yup.number().required(),
  discount: yup
    .object({
      value: yup.number().optional().nullable(),
      currency: yup.string().required('Currency is required'),
      isFixed: yup.boolean().required('Is Fixed is required'),
    }),
  note: yup.string().optional(),
})
