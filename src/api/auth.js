import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function deleteSession() {
  return axios.delete('/people/session.json', constructURLSearchParams({
      action: 'delete'
  }));
};

export function addSession(credentials) {
  const { username, password } = credentials;
  return axios.post('/people/session.json', constructURLSearchParams({
      username,
      password,
      remember: 1
  }));
};

export function readSession() {
    return axios.get('/people/session.json');
}
