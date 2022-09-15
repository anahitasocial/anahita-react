/* eslint-disable global-require */
if (process.env.REACT_APP_ASSETS) {
  const assets = `./${process.env.REACT_APP_ASSETS}`;
  // eslint-disable-next-line import/no-dynamic-require
  module.exports = require(assets);
} else {
  module.exports = require('./default');
}
