import * as yup from 'yup'

export const categorySchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  status: yup.boolean().optional(),
  icon: yup.mixed().optional(),
  description: yup.string().optional(),
})
