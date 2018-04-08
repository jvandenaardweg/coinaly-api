const apiKeys = require('./api-keys')

describe('helpers/api-keys', () => {
  it('returns public keys', () => {
    const expected = {
      apiKey: undefined,
      apiSecret: undefined
    }

    expect(apiKeys.getPublicApiKeySecret('bittrex')).toMatchObject(expected)
    expect(apiKeys.getPublicApiKeySecret('binance')).toMatchObject(expected)
  })

  it('returns user private keys', () => {
    const expected = {
      apiKey: null,
      apiSecret: null
    }

    expect(apiKeys.getPrivateApiKeySecret('bittrex')).toMatchObject(expected)
    expect(apiKeys.getPrivateApiKeySecret('binance')).toMatchObject(expected)
  })
})
