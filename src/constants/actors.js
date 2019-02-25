import async from './async';

const actors = async('actors');
const avatar = async('avatar');
const cover = async('cover');

export default {
  BROWSE: {
    ...actors('browse'),
    RESET: 'ACTORS_BROWSE_RESET',
  },
  READ: actors('read'),
  EDIT: actors('edit'),
  ADD: actors('add'),
  DELETE: actors('delete'),
  FOLLOW: actors('follow'),
  UNFOLLOW: actors('unfollow'),
  BLOCK: actors('block'),
  UNBLOCK: actors('unblock'),
  AVATAR: {
    ADD: avatar('add'),
    DELETE: avatar('delete'),
  },
  COVER: {
    ADD: cover('add'),
    DELETE: cover('delete'),
  },
};
