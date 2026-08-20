import * as yup from 'yup'

export const announcementSchema = yup.object().shape({
  title: yup.object().required(),
  description: yup.object(),
  banner: yup.string().required(),
  status: yup.boolean(),
  startAt: yup.date().required(),
  expireAt: yup.date().required(),
  order: yup.number()
})
