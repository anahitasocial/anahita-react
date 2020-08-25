import axios from 'axios';

function reset(person) {
  const { email } = person;
  return axios.post('/people/token.json', { email });
}

export default {
  reset,
};
