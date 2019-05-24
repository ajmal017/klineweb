if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/klinecharts.production.js')
} else {
  module.exports = require('./build/klinecharts.development.js')
}
