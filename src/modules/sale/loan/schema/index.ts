import * as yup from 'yup'

export const writeOffSchema = yup.object({
  transactions: yup
    .array()
    .of(
      yup.object().shape({
        writeOffType: yup.string().required(),
        remainingCostCurrency: yup.string().required(),
        remainingCost: yup.number().required(),
        newPrice: yup.number().required(),
        newPriceCurrency: yup.string().required(),
        condition: yup.string().optional(),
        reason: yup.string().optional(),
        note: yup.string().optional(),
      })
    )
    .min(1, "At least one user is required"),
})