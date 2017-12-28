if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev');
} else {
  module.exports = require('./prod');
}
