import async from './async';

const likes = async('likes');

export default {
  BROWSE: {
    ...likes('browse'),
    RESET: 'LIKES_BROWSE_RESET',
  },
  ADD: likes('add'),
  DELETE: likes('delete'),
};
