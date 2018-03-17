import async from './async';

const actor = async('actor');
export default {
  READ: actor('read'),
  EDIT: actor('edit'),
  ADD: actor('add'),
  DELETE: actor('delete'),
  FOLLOW: actor('follow'),
  UNFOLLOW: actor('unfollow'),
  BLOCK: actor('block'),
  UNBLOCK: actor('unblock'),
};
