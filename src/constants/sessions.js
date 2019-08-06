import async from './async';

const sessions = async('sessions');

export default {
  RESET: 'SESSIONS_RESET',
  READ: sessions('read'),
  ADD: sessions('add'),
  DELETE: sessions('delete'),
};
