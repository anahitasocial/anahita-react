import async from './async';

const signup = async('signup');

export default {
  ADD: signup('add'),
  IS_EMAIL: signup('is_email'),
  IS_USERNAME: signup('is_username'),
  FIELDS: {
    GIVEN_NAME: {
      MAX_LENGTH: 30,
      MIN_LENGTH: 3,
    },
    FAMILY_NAME: {
      MAX_LENGTH: 30,
      MIN_LENGTH: 3,
    },
    USERNAME: {
      MAX_LENGTH: 30,
      MIN_LENGTH: 3,
    },
    EMAIL: {
      MAX_LENGTH: 80,
      MIN_LENGTH: 10,
    },
    PASSWORD: {
      MAX_LENGTH: 80,
      MIN_LENGTH: 8,
    },
  },
};
