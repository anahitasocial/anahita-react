import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function reset(person) {
  const { email } = person;
  return axios.post('/people/token.json', constructFormData({ email }));
}

export default {
  reset,
};
