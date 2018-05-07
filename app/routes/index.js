
module.exports = [
  ...require('./auth'),
  ...require('./balances'),
  ...require('./currencies'),
  ...require('./deposits'),
  ...require('./exchanges'),
  ...require('./keys'),
  ...require('./markets'),
  ...require('./orders'),
  ...require('./tickers'),
  ...require('./users'),
  ...require('./withdrawals')
]
