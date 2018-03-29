import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function deleteSession() {
  return axios.delete('/people/session.json', constructURLSearchParams({
    action: 'delete',
  }));
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
    firstName,
    lastName,
    email,
    password,
  } = params;
  return axios.post('/person.json', constructURLSearchParams({
    firstName,
    lastName,
    email,
    password,
  }));
}
