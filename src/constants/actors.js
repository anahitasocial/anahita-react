import async from './async';

const actors = async('actors');
const actor = async('actor');
const avatar = async('avatar');
const cover = async('cover');

export default {
  RESET: 'ACTORS_RESET',
  BROWSE: actors('browse'),
  READ: actor('read'),
  EDIT: actor('edit'),
  ADD: actor('add'),
  DELETE: actor('delete'),
  FOLLOW: actor('follow'),
  UNFOLLOW: actor('unfollow'),
  BLOCK: actor('block'),
  UNBLOCK: actor('unblock'),
  AVATAR: {
    ADD: avatar('add'),
    DELETE: avatar('delete'),
  },
  COVER: {
    ADD: cover('add'),
    DELETE: cover('delete'),
  },
};
