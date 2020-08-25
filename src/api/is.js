import axios from 'axios';

function isAvailable(key, value) {
  return axios.post('/people/person.json', {
    action: 'validate',
    key,
    value,
  });
}

function email(value) {
  return isAvailable('email', value);
}

function username(value) {
  return isAvailable('username', value);
}

export default {
  email,
  username,
};
