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

export function signup(params) {
  const {
    givenName,
    familyName,
    username,
    email,
    password,
  } = params;
  return axios.post('/people/person.json', constructURLSearchParams({
    givenName,
    familyName,
    username,
    email,
    password,
  }));
}
