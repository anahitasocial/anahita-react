import async from './async';

const person = async('person');

export default {
  EDIT: person('edit'),
  EDIT_ACCOUNT: person('account'),
  ADD: person('add'),
  TYPE: {
    GUEST: 'guest',
    REGISTERED: 'registered',
    ADMIN: 'administrator',
    SUPER_ADMIN: 'super-administrator',
  },
};
