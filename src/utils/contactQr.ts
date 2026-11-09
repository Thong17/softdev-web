// Reads the customer details a QR code carries:
// - vCard (BEGIN:VCARD): contacts "share as QR", business cards
// - MeCard (MECARD:...): older phones and many QR generators
// - Telegram profile links, tel:, mailto: and geo: codes
// Only fields our customer form has are returned.

export interface IContactFields {
  fullName?: string
  displayName?: string // main phone
  contact?: string // second phone
  email?: string
  telegram?: string
  companyName?: string
  type?: 'BUSINESS'
  address?: string
  dateOfBirth?: string
  note?: string
  location?: { lat: number, lng: number }
}

export const parseTelegram = (text: string): string | null => {
  const value = (text || '').trim()
  const link = value.match(/^(?:https?:\/\/)?(?:www\.)?(?:t|telegram)\.(?:me|dog)\/(\+?[\w\d]+)/i)
  if (link) return link[1].startsWith('+') ? link[1] : `@${link[1]}`
  const resolve = value.match(/^tg:\/\/resolve\?(?:.*&)?domain=([\w\d]+)/i)
  if (resolve) return `@${resolve[1]}`
  if (/^@[\w\d]{3,}$/.test(value)) return value
  return null
}

// Cambodian numbers are saved the local way: +855 12 345 678 -> 012345678
const normalizePhone = (value: string) => {
  const digits = value.replace(/[^\d+]/g, '')
  if (digits.startsWith('+855')) return `0${digits.slice(4)}`
  if (digits.startsWith('855') && digits.length >= 11) return `0${digits.slice(3)}`
  return digits
}

const normalizeDate = (value: string) => {
  const compact = value.match(/^(\d{4})(\d{2})(\d{2})/)
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`
  const dashed = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return dashed ? `${dashed[1]}-${dashed[2]}-${dashed[3]}` : undefined
}

const parseGeo = (value: string) => {
  const match = value.replace(/^geo:/i, '').match(/(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)/)
  if (!match) return undefined
  const lat = Number(match[1])
  const lng = Number(match[2])
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : undefined
}

const unescapeValue = (value: string) => value
  .replace(/\\n/gi, '\n')
  .replace(/\\([,;:\\])/g, '$1')
  .trim()

const decodeQuotedPrintable = (value: string) => {
  try {
    const bytes = value.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, hex) => `%${hex}`)
    return decodeURIComponent(bytes)
  } catch {
    return value
  }
}

// Splits on a separator that isn't escaped with a backslash
const splitUnescaped = (value: string, separator: string) => {
  const parts: string[] = []
  let current = ''
  for (let index = 0; index < value.length; index++) {
    const char = value[index]
    if (char === '\\' && index + 1 < value.length) {
      current += char + value[index + 1]
      index++
    } else if (char === separator) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current)
  return parts
}

const parseVCard = (text: string): IContactFields => {
  const fields: IContactFields = {}
  const phones: string[] = []
  let structuredName = ''
  // Long lines continue on the next line after a space or tab
  const lines = text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n')
  lines.forEach((line) => {
    const colon = line.indexOf(':')
    if (colon < 0) return
    const [rawName, ...params] = line.slice(0, colon).split(';')
    // Drop "item1." style group prefixes
    const name = rawName.replace(/^[^.]+\./, '').toUpperCase()
    let value = line.slice(colon + 1)
    if (params.some((param) => /QUOTED-PRINTABLE/i.test(param))) value = decodeQuotedPrintable(value)
    if (!value.trim()) return

    switch (name) {
      case 'FN':
        fields.fullName = unescapeValue(value)
        break
      case 'N': {
        const [last, first, middle] = splitUnescaped(value, ';').map(unescapeValue)
        structuredName = [first, middle, last].filter(Boolean).join(' ')
        break
      }
      case 'TEL':
        phones.push(normalizePhone(unescapeValue(value).replace(/^tel:/i, '')))
        break
      case 'EMAIL':
        fields.email = fields.email || unescapeValue(value)
        break
      case 'ORG': {
        const [company] = splitUnescaped(value, ';').map(unescapeValue)
        if (company) {
          fields.companyName = company
          fields.type = 'BUSINESS'
        }
        break
      }
      case 'ADR': {
        // PO box; extended; street; city; region; postal code; country
        const parts = splitUnescaped(value, ';').map(unescapeValue).filter(Boolean)
        if (parts.length) fields.address = parts.join(', ')
        break
      }
      case 'BDAY':
        fields.dateOfBirth = normalizeDate(unescapeValue(value))
        break
      case 'NOTE':
        fields.note = unescapeValue(value)
        break
      case 'GEO':
        fields.location = parseGeo(unescapeValue(value))
        break
      case 'URL':
      case 'IMPP':
      case 'X-SOCIALPROFILE':
      case 'X-TELEGRAM': {
        const telegram = parseTelegram(unescapeValue(value).replace(/^(x-)?telegram:/i, 't.me/'))
        if (telegram) fields.telegram = fields.telegram || telegram
        break
      }
      default:
        break
    }
  })
  if (!fields.fullName && structuredName) fields.fullName = structuredName
  if (phones[0]) fields.displayName = phones[0]
  if (phones[1]) fields.contact = phones[1]
  return fields
}

const parseMeCard = (text: string): IContactFields => {
  const fields: IContactFields = {}
  const phones: string[] = []
  splitUnescaped(text.replace(/^MECARD:/i, ''), ';').forEach((entry) => {
    const colon = entry.indexOf(':')
    if (colon < 0) return
    const key = entry.slice(0, colon).toUpperCase()
    const value = unescapeValue(entry.slice(colon + 1))
    if (!value) return
    switch (key) {
      case 'N': {
        // "Last,First"
        const [last, first] = value.split(',').map((part) => part.trim())
        fields.fullName = [first, last].filter(Boolean).join(' ')
        break
      }
      case 'TEL':
        phones.push(normalizePhone(value))
        break
      case 'EMAIL':
        fields.email = fields.email || value
        break
      case 'ADR':
        fields.address = value.split(',').map((part) => part.trim()).filter(Boolean).join(', ')
        break
      case 'BDAY':
        fields.dateOfBirth = normalizeDate(value)
        break
      case 'NOTE':
      case 'MEMO':
        fields.note = value
        break
      case 'ORG':
        fields.companyName = value
        fields.type = 'BUSINESS'
        break
      case 'URL': {
        const telegram = parseTelegram(value)
        if (telegram) fields.telegram = telegram
        break
      }
      default:
        break
    }
  })
  if (phones[0]) fields.displayName = phones[0]
  if (phones[1]) fields.contact = phones[1]
  return fields
}

export const parseContactQr = (text: string): IContactFields => {
  const value = (text || '').trim()
  let fields: IContactFields = {}
  if (/^BEGIN:VCARD/i.test(value)) fields = parseVCard(value)
  else if (/^MECARD:/i.test(value)) fields = parseMeCard(value)
  else if (/^tel:/i.test(value)) fields = { displayName: normalizePhone(value.slice(4)) }
  else if (/^mailto:/i.test(value)) fields = { email: value.slice(7).split('?')[0] }
  else if (/^geo:/i.test(value)) fields = { location: parseGeo(value) }
  else {
    const telegram = parseTelegram(value)
    if (telegram) fields = { telegram }
  }
  // A Telegram phone link (t.me/+855...) also gives the phone number when
  // the card itself has none
  if (fields.telegram?.startsWith('+') && !fields.displayName) fields.displayName = normalizePhone(fields.telegram)
  // Drop empty results (e.g. an unreadable date)
  Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key])
  return fields
}

export const contactFieldLabels: Record<keyof IContactFields, string> = {
  fullName: 'Name',
  displayName: 'Phone',
  contact: 'Second phone',
  email: 'Email',
  telegram: 'Telegram',
  companyName: 'Company',
  type: 'Type',
  address: 'Address',
  dateOfBirth: 'Birthday',
  note: 'Note',
  location: 'Location',
}
