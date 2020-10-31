import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function add(person) {
  return axios.post('/people/signup.json', constructFormData(person));
}

export default {
  add,
};
