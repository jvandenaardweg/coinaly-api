const CryptoJS = require('crypto-js')

function encryptString (string, secret) {
  return CryptoJS.AES.encrypt(string, secret).toString()
}

function decryptString (encryptedData, secret) {
  const bytes = CryptoJS.AES.decrypt(encryptedData.toString(), secret)
  return bytes.toString(CryptoJS.enc.Utf8)
}

module.exports = {
  encryptString,
  decryptString
}
