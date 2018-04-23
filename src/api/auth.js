import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function deleteSession() {
  return axios.delete('/people/session.json');
}

export function addSession(credentials) {
  const { username, password } = credentials;
  return axios.post('/people/session.json', constructURLSearchParams({
    username,
    password,
  }));
}

export function readSession() {
  return axios.get('/people/session.json');
}

export function signup(person) {
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

export function resetPassword(person) {
  const { email } = person;
  return axios.post('/people/token.json', constructURLSearchParams({
    email,
  }));
}
