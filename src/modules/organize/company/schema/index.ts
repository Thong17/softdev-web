import * as yup from 'yup'

export const companySchema = yup.object().shape({
  name: yup.object({
    English: yup.string().required('English is required'),
  }),
  legalName: yup.string().optional(),
  status: yup.boolean().optional(),
  contact: yup.string().optional(),
  email: yup.string().email('Invalid email').optional(),
  address: yup.string().optional(),
  logo: yup.mixed().optional(),
})
