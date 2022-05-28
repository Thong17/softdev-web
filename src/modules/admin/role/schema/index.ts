import * as yup from 'yup'

export const roleSchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  status: yup.boolean().optional(),
  description: yup.string().optional(),
  privilege: yup.object().required(),
})
