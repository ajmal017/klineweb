if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/kline.production.js')
} else {
  module.exports = require('./build/kline.development.js')
}
