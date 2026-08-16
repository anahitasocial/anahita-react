import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

// Kicks off the reset mail. auth-service replaced the monolith's
// /people/token.json with /password/forgot.
//
// Note this endpoint belongs to the server-rendered password flow, so a
// success answers with an HTML page rather than JSON — treat the 2xx as
// the signal and ignore the body. The link in the mail lands the person
// on auth-service's own /password/reset page, which completes the reset
// outside this app.
function reset(person) {
  const { email } = person;
  return axios.post('/password/forgot', constructFormData({ email }));
}

export default {
  reset,
};
