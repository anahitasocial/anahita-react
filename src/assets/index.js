if (process.env.REACT_APP_ASSETS) {
  module.exports = require(`./${process.env.REACT_APP_ASSETS}`);
} else {
  module.exports = require('./default');
}
