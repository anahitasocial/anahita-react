import axios from 'axios';
import { constructURLSearchParams } from './utils';

function signup(person) {
  const {
    givenName,
    familyName,
    username,
    email,
    password,
  } = person;

  return axios.post('/people/person.json', constructURLSearchParams({
    action: 'signup',
    givenName,
    familyName,
    username,
    email,
    password,
  }));
}

function resetPassword(person) {
  const { email } = person;
  return axios.post('/people/token.json', constructURLSearchParams({
    email,
  }));
}

function validateField(key, value) {
  return axios.post('/people/person.json', constructURLSearchParams({
    action: 'validate',
    key,
    value,
  }));
}

export default {
  signup,
  resetPassword,
  validateField,
};
