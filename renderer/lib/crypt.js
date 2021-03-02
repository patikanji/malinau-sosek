const crypto = require('crypto')
const SECRET = 'SOSEKMENTARANG'

function passwordCrypt(str) {
  const hasher = crypto.createHmac('md5', SECRET)
  const hash = hasher.update(str).digest('hex')
  return hash
}

export default passwordCrypt

// harM0er |