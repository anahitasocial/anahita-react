if (process.env.REACT_APP_THEME) {
  module.exports = require(`./${process.env.REACT_APP_THEME}`);
} else {
  module.exports = require('./default');
}
