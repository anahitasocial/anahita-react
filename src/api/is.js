import axios from 'axios';
import { constructURLSearchParams } from './utils';

function isAvailable(key, value) {
  return axios.post('/people/person.json', constructURLSearchParams({
    action: 'validate',
    key,
    value,
  }));
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
