import async from './async';

const session = async('session');

export default {
  RESET: 'SESSION_RESET',
  READ: session('read'),
  ADD: session('add'),
  DELETE: session('delete'),
};
