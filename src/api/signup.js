import axios from 'axios';
import { constructURLSearchParams } from './utils';

function add(person) {
  return axios.post('/people/signup.json', constructURLSearchParams(person));
}

export default {
  add,
};
