// Props for password inputs that browsers and password managers should leave
// alone (no saved-password dropdown, no "suggest strong password", no filling
// in the signed-in admin's own login): login, creating a user, changing a
// password. Browsers ignore autocomplete="off" on type="password", so the input
// is a text input masked with dots by CSS instead. Where a browser can't mask
// with CSS, it stays a password input, so the value is never shown by accident.
const canMask = typeof CSS !== 'undefined' && !!CSS.supports?.('-webkit-text-security', 'disc')

export const secretInputProps = (visible = false): any => ({
  type: visible || canMask ? 'text' : 'password',
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
  // Password managers' own "ignore this field" markers (LastPass, 1Password,
  // Bitwarden, Dashlane)
  'data-lpignore': 'true',
  'data-1p-ignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
  style: !visible && canMask ? { WebkitTextSecurity: 'disc' } : undefined,
})
