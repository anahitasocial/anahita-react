import async from './async';

const person = async('person');

export default {
  VALIDATE_EMAIL: person('validate_email'),
  VALIDATE_USERNAME: person('validate_USERNAME'),
  FIELDS: {
    // One name, matching the API. given/family assumed a Western name
    // structure and capped each half at 20 characters, so plenty of real
    // names did not fit even before the validator rejected the space between
    // them.
    NAME: {
      MAX_LENGTH: 100,
      MIN_LENGTH: 1,
    },
    PRONOUNS: {
      MAX_LENGTH: 50,
      MIN_LENGTH: 0,
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
    USERTYPE: {
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
