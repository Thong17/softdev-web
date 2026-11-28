// Runs after `npm run build`: writes build/sw.js from scripts/sw.template.js
// with every built file to keep for offline use, and a version that changes
// with the build so browsers install the new app.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// CRA's BUILD_PATH, when set, moves the output folder
const build = path.resolve(__dirname, '..', process.env.BUILD_PATH || 'build')
const manifest = JSON.parse(fs.readFileSync(path.join(build, 'asset-manifest.json'), 'utf8'))

const files = new Set(['/index.html', '/manifest.json', '/favicon.ico'])
Object.values(manifest.files)
  .filter((file) => !file.endsWith('.map') && !file.endsWith('.LICENSE.txt'))
  .forEach((file) => files.add(file))
const icons = path.join(build, 'icons')
if (fs.existsSync(icons)) fs.readdirSync(icons).forEach((icon) => files.add(`/icons/${icon}`))

const precache = [...files].filter((file) => fs.existsSync(path.join(build, file)))
const version = crypto.createHash('sha256').update(JSON.stringify(manifest.files)).digest('hex').slice(0, 12)
const template = fs.readFileSync(path.join(__dirname, 'sw.template.js'), 'utf8')
fs.writeFileSync(
  path.join(build, 'sw.js'),
  template.replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(precache, null, 2))
)
console.log(`Service worker: ${precache.length} files kept for offline use (version ${version})`)
