import async from './async';

const person = async('person');

export default {
  VALIDATE_EMAIL: person('validate_email'),
  VALIDATE_USERNAME: person('validate_USERNAME'),
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
};
