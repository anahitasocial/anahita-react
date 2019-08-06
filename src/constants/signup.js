import async from './async';

const signup = async('signup');

export default {
  ADD: signup('add'),
  IS_EMAIL: signup('is_email'),
  IS_USERNAME: signup('is_username'),
};
