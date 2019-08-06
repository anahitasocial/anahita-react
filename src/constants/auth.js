import async from './async';

const auth = async('auth');
const password = async('password');
const validate = async('validate');

export default {
  RESET: 'AUTH_RESET',
  LOGIN: auth('login'),
  LOGOUT: auth('logout'),
  SIGNUP: auth('signup'),
  PASSWORD: {
    RESET: password('reset'),
  },
  VALIDATE: {
    EMAIL: {
      ...validate('email'),
      RESET: 'VALIDATE_EMAIL_RESET',
    },
    USERNAME: {
      ...validate('username'),
      RESET: 'VALIDATE_USERNAME_RESET',
    },
  },
};
