import * as yup from 'yup'

const discountSchema = yup.object().shape({
  type: yup.string().oneOf(['product', 'category', 'brand']).required(),
  target: yup.array().of(yup.string().required()).min(1).required(),
  discountType: yup.string().oneOf(['percentage', 'fixed']).required(),
  value: yup.number().min(0).required(),
})

export const membershipSchema = yup.object().shape({
  description: yup.object().required(),
  discounts: yup
    .object()
    .required()
    .test('discounts-object', 'Discounts must contain at least one valid discount', (value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return false
      const keys = Object.keys(value)
      return keys.length > 0 && keys.every((key) => {
        const discount = value[key]
        if (!discount || typeof discount !== 'object') return false
        return discountSchema.isValidSync(discount)
      })
    }),
  startAt: yup.date().required(),
  expireAt: yup
    .date()
    .required()
    .test('expire-after-start', 'Expire date must be after start date', function (value) {
      const { startAt } = this.parent
      if (!value || !startAt) return false
      return new Date(value) > new Date(startAt)
    }),
  note: yup.string().optional(),
  isActive: yup.boolean().default(true),
})