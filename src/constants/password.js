import async from './async';

const password = async('password');

export default {
  RESET: password('reset'),
  FIELDS: {
    EMAIL: {
      MAX_LENGTH: 80,
      MIN_LENGTH: 8,
    },
  },
};
