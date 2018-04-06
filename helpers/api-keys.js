function getPublicApiKeySecret (exchangeSlug) {
  let apiKey
  let apiSecret
  if (exchangeSlug === 'bittrex') {
    apiKey = process.env.PUBLIC_BITTREX_API_KEY
    apiSecret = process.env.PUBLIC_BITTREX_API_SECRET
  } else if (exchangeSlug === 'binance') {
    apiKey = process.env.PUBLIC_BINANCE_API_KEY
    apiSecret = process.env.PUBLIC_BINANCE_API_SECRET
  } else {
    throw new Error('Exchange not supported.')
  }

  return {
    apiKey: apiKey,
    apiSecret: apiSecret
  }
}

module.exports = {
  getPublicApiKeySecret
}

