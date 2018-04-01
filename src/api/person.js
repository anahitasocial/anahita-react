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

export function editPersonAccount(actor) {
  const { username, email, password } = actor;
  return axios.post(`/people/${actor.id}.json`, constructURLSearchParams({
    username,
    email,
    password,
  }));
}

export function addPerson(actor) {
  const {
    firstName,
    lastName,
    email,
  } = actor;
  return axios.post('/people.json', constructURLSearchParams({
    firstName,
    lastName,
    email,
  }));
}
