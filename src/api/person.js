import axios from 'axios';
import { constructURLSearchParams } from './utils';

function read(id) {
  return axios.get(`/people/${id}.json`);
}

function edit(person) {
  const {
    givenName,
    familyName,
    body,
    gender,
    usertype,
  } = person;

  return axios.post(`/people/${person.id}.json`, constructURLSearchParams({
    givenName,
    familyName,
    body,
    gender,
    usertype,
  }));
}

function editAccount(person) {
  const { username, email, password } = person;

  return axios.post(`/people/${person.id}.json`, constructURLSearchParams({
    username,
    email,
    password,
  }));
}

function add(person) {
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

export default {
  read,
  edit,
  editAccount,
  add,
};
