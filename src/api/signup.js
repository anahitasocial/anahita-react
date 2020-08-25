import axios from 'axios';

function add(person) {
  return axios.post('/people/signup.json', person);
}

export default {
  add,
};
