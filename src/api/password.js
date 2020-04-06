import axios from 'axios';
import { constructURLSearchParams } from './utils';

function reset(email) {
  return axios.post('/people/token.json', constructURLSearchParams({
    email,
  }));
}

export default {
  reset,
};
