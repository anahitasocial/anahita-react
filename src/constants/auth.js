import async from './async';

const auth = async('auth');
const password = async('password');
const validate = async('validate');

export default {
  LOGIN: auth('login'),
  LOGOUT: auth('logout'),
  SIGNUP: auth('signup'),
  PASSWORD: {
    RESET: password('reset'),
  },
  VALIDATE: {
    EMAIL: validate('email'),
    USERNAME: validate('username'),
  },
};
