// Passwords the admin can hand to a new user. Letters and digits only (the API
// allows nothing else), at least one lowercase letter and one digit (the API's
// strength rule), plus an uppercase letter. Look-alikes (0/O, 1/l/I) are left
// out so the password can be read out or typed from a phone without mistakes.
const LOWER = 'abcdefghijkmnpqrstuvwxyz'
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const DIGITS = '23456789'
const ALL = LOWER + UPPER + DIGITS

const randomIndex = (max: number) => {
  const values = new Uint32Array(1)
  // Rejection sampling: no bias towards the first characters
  const limit = Math.floor(0x100000000 / max) * max
  do {
    window.crypto.getRandomValues(values)
  } while (values[0] >= limit)
  return values[0] % max
}

const pick = (chars: string) => chars[randomIndex(chars.length)]

export const generatePassword = (length = 10): string => {
  const chars = [pick(LOWER), pick(UPPER), pick(DIGITS)]
  while (chars.length < length) chars.push(pick(ALL))
  // Shuffle so the required characters aren't always first
  for (let index = chars.length - 1; index > 0; index--) {
    const swap = randomIndex(index + 1)
    ;[chars[index], chars[swap]] = [chars[swap], chars[index]]
  }
  return chars.join('')
}

// Same rule as the API: 7–30 letters or digits, with a lowercase letter and a digit
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{7,30}$/
