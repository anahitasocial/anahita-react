import async from './async';

const person = async('person');

export default {
  VALIDATE_EMAIL: person('validate_email'),
  VALIDATE_USERNAME: person('validate_USERNAME'),
  FIELDS: {
    GIVEN_NAME: {
      MAX_LENGTH: 20,
      MIN_LENGTH: 2,
    },
    FAMILY_NAME: {
      MAX_LENGTH: 20,
      MIN_LENGTH: 2,
    },
    BODY: {
      MAX_LENGTH: 500,
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
    TYPE: {
      GUEST: 'guest',
      REGISTERED: 'registered',
      ADMIN: 'administrator',
      SUPER_ADMIN: 'super-administrator',
    },
    GENDER: {
      FEMALE: 'female',
      MALE: 'male',
      NEUTRAL: 'neutral',
      OTHER: 'other',
    },
  },
};
