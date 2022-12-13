import * as yup from 'yup'

export const telegramConfigSchema = yup.object().shape({
  telegramAPIKey: yup.string().required(),
  telegramChatID: yup.string().required(),
  telegramPrivilege: yup.object().shape({
    SENT_AFTER_PAYMENT: yup.boolean(),
    SENT_AFTER_OPEN_DRAWER: yup.boolean(),
    SENT_AFTER_CLOSE_DRAWER: yup.boolean(),
  }),
})
