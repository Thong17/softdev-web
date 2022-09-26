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

export const structureSchema = yup.object().shape({
  title: yup.string().required(),
  price: yup.object({
    value: yup.number().required('Price is required'),
    currency: yup.string().optional(),
    duration: yup.string().optional(),
  }),
  size: yup.string().required(),
  type: yup.string().optional(),
  length: yup.number().required(),
  direction: yup.string().required(),
  justify: yup.string().required(),
  align: yup.string().required(),
  description: yup.string().optional(),
})

export const floorSchema = yup.object().shape({
  floor: yup.string().required(),
  order: yup.number().required(),
  description: yup.string().optional(),
})

export const transferSchema = yup.object().shape({
  title: yup.string().required(),
  image: yup.mixed(),
})