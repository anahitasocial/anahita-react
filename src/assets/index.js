/* eslint-disable global-require */
if (process.env.REACT_APP_ASSETS) {
  // eslint-disable-next-line import/no-dynamic-require
  module.exports = require(`./${process.env.REACT_APP_ASSETS}`);
} else {
  module.exports = require('./default');
}
