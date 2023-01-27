import async from './async';

const socialgraph = async('socialgraph');

export default {
  BROWSE: {
    ...socialgraph('browse'),
    RESET: 'SOCIALGRAPH_BROWSE_RESET',
  },
  FOLLOW: socialgraph('follow'),
  UNFOLLOW: socialgraph('unfollow'),
  REMOVE_FOLLOWER: socialgraph('remove_follower'),
  BLOCK: socialgraph('block'),
  UNBLOCK: socialgraph('unblock'),
  BLOCK_FOLLOWER: socialgraph('block_follower'),
};
