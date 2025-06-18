import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mode = process.argv[2] // 'dev' or 'prod'
const from = path.resolve(__dirname, `../capacitor.config.${mode}.json`)
const to = path.resolve(__dirname, '../capacitor.config.json')

if (!fs.existsSync(from)) {
  console.error(`❌ Missing config file: capacitor.config.${mode}.json`)
  process.exit(1)
}

fs.copyFileSync(from, to)
console.log(`✅ capacitor.config.json switched to '${mode}' mode`)
