import axios from 'axios';
import { constructURLSearchParams } from './utils';

function add(person) {
  return axios.post('/people/person.json', constructURLSearchParams({
    action: 'signup',
    ...person,
  }));
}

export default {
  add,
};
