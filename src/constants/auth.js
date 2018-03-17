import async from './async';

const auth = async('auth');
export default {
  LOGIN: auth('login'),
  LOGOUT: auth('logout'),
};
