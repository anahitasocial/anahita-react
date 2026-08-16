import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

// auth-service owns registration now; the old monolith's
// /people/signup.json is gone. The handler binds form fields
// (email, username, password), so keep sending form data.
function add(person) {
  return axios.post('/signups', constructFormData(person));
}

export default {
  add,
};
