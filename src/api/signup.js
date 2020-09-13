import axios from 'axios';
import { constructFormData } from './utils';

function add(person) {
  return axios.post('/people/signup.json', constructFormData(person));
}

export default {
  add,
};
