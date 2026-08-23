import localProductImages from 'constants/localProductImages.json'

const IMAGE_HOST = process.env.REACT_APP_API_UPLOADS

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const localImageBySlug: Record<string, string> = {}
localProductImages.forEach((file: string) => {
  localImageBySlug[file.replace(/\.[^.]+$/, '')] = file
})

/**
 * Product photo isn't always uploaded through the admin yet, so this falls back
 * to a locally-bundled photo matched by slugified product name (public/assets/products/)
 * before giving up to the generic default.png.
 */
export const resolveProductImage = (name: string, filename?: string) => {
  if (filename) return `${IMAGE_HOST}${filename}`

  const localMatch = localImageBySlug[slugify(name)]
  if (localMatch) return `/assets/products/${localMatch}`

  return `${IMAGE_HOST}default.png`
}
