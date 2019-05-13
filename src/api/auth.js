import axios from 'axios';
import { constructURLSearchParams } from './utils';

function readSession() {
  return axios.get('/people/session.json');
}

function addSession(credentials) {
  const { username, password } = credentials;
  return axios.post('/people/session.json', constructURLSearchParams({
    username,
    password,
  }));
}

function deleteSession() {
  return axios.delete('/people/session.json');
}

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
  readSession,
  addSession,
  deleteSession,
  signup,
  resetPassword,
  validateField,
};
