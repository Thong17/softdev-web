import * as yup from 'yup'

export const telegramConfigSchema = yup.object().shape({
  telegramAPIKey: yup.string().required(),
  telegramChatID: yup.string().required(),
  telegramPrivilege: yup.object().shape({
    SENT_AFTER_PAYMENT: yup.boolean(),
    SENT_AFTER_OPEN_DRAWER: yup.boolean(),
    SENT_AFTER_CLOSE_DRAWER: yup.boolean(),
    SENT_PAY_LATER_OVERDUE: yup.boolean(),
  }),
  // Pay Later overdue summary send time (shop time)
  payLaterOverdueTime: yup.string().matches(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choose a time'),
})
