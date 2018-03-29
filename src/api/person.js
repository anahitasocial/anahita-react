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

export function editPersonAccount(actor, password) {
  const { username, email } = actor;
  return axios.post(`/person/${actor.id}.json`, constructURLSearchParams({
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
  return axios.post('/person.json', constructURLSearchParams({
    firstName,
    lastName,
    email,
  }));
}
