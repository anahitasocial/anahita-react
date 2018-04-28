import async from './async';

const auth = async('auth');

export default {
  LOGIN: auth('login'),
  LOGOUT: auth('logout'),
  SIGNUP: auth('signup'),
  PASSWORD_RESET: auth('password_reset'),
  VALIDATE_EMAIL: auth('validate_email'),
  VALIDATE_USERNAME: auth('validate_username'),
};
