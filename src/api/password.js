import axios from 'axios';

// No currentPassword. requests.PasswordEdit has no such field — proof
// travels as the step-up marker the server checks, not in this body.
function edit(params) {
  const { password } = params;
  return axios.patch('password/change', {
    password,
  });
}

export default {
  edit,
};
