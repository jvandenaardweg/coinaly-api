const encryption = require('../encryption')

describe('helpers/encryption', () => {
  it('returns an encrypted string', () => {
    expect(typeof encryption.encryptString('string', 'secret')).toBe('string')
  })

  it('returns an decrypted string', () => {
    // console.log(encryption.encryptString('this was encrypted', 'secret'))
    expect(encryption.decryptString('U2FsdGVkX186e/7dMGZ1/166cJAJE1Dz8r8iYBbs49ZNx9TOwDVoPzKp8Hed/Cxt', 'secret')).toBe('this was encrypted')
  })
})
