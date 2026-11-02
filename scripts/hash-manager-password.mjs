import { randomBytes, scrypt as scryptCallback } from 'node:crypto'
import { promisify } from 'node:util'
// Refuse an interactive terminal: a shell can read the password without echo.
if (process.stdin.isTTY) throw new Error('Передайте пароль в stdin без отображения ввода; см. README')
const chunks = []
for await (const chunk of process.stdin) chunks.push(chunk)
const password = Buffer.concat(chunks).toString('utf8')
if (password.length < 16 || password.length > 512) throw new Error('Пароль должен содержать от 16 до 512 символов')
const salt = randomBytes(16)
const hash = await promisify(scryptCallback)(password, salt, 64)
console.log(`scrypt:${salt.toString('hex')}:${hash.toString('hex')}`)
