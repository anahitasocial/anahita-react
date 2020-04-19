import axios from 'axios';
import { constructURLSearchParams } from './utils';

function reset(person) {
  const { email } = person;
  return axios.post('/people/token.json', constructURLSearchParams({
    email,
  }));
}

export default {
  reset,
};
