import axios from 'axios';
import { constructURLSearchParams } from './utils';

export function editPerson(person) {
  const {
    givenName,
    familyName,
    body,
    gender,
  } = person;
  return axios.post(`/people/${person.id}.json`, constructURLSearchParams({
    givenName,
    familyName,
    body,
    gender,
  }));
}

export function editPersonAccount(person) {
  const { username, email, password } = person;
  return axios.post(`/people/${person.id}.json`, constructURLSearchParams({
    username,
    email,
    password,
  }));
}

export function addPerson(person) {
  const {
    givenName,
    familyName,
    username,
    email,
    usertype,
  } = person;
  return axios.post('/people.json', constructURLSearchParams({
    givenName,
    familyName,
    username,
    email,
    usertype,
  }));
}
