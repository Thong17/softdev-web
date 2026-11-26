import * as yup from 'yup'
import { PASSWORD_PATTERN } from 'utils/password'

const PASSWORD_RULE = 'At least 7 letters or digits, including a lowercase letter and a digit'

// Email is optional (users sign in with their username)
const email = yup.string().email('Invalid email').optional()

export const createUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required('Password is required').matches(PASSWORD_PATTERN, PASSWORD_RULE),
  email,
  role: yup.string().required(),
  expireAt: yup.date().nullable().default(undefined)
    .transform((curr, orig) => orig === '' ? null : curr)
    .typeError('Invalid Date'),
})

// Password: Reset Password, only for roles that may reset passwords; empty keeps it
export const updateUserSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().optional()
    .test('rule', PASSWORD_RULE, (value) => !value || PASSWORD_PATTERN.test(value)),
  email,
  role: yup.string().required(),
  expireAt: yup.date().nullable().default(undefined)
    .transform((curr, orig) => orig === '' ? null : curr)
    .typeError('Invalid Date'),
})
