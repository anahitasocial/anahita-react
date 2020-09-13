import axios from 'axios';
import { constructFormData } from './utils';

function reset(person) {
  const { email } = person;
  return axios.post('/people/token.json', constructFormData({ email }));
}

export default {
  reset,
};
