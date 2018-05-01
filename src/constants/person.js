import async from './async';

const person = async('person');

export default {
  VALIDATE_EMAIL: person('validate_email'),
  VALIDATE_USERNAME: person('validate_USERNAME'),
  EDIT: person('edit'),
  EDIT_ACCOUNT: person('account'),
  ADD: person('add'),
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
  },
};
