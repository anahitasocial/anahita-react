import async from './async';

const socialgraph = async('socialgraph');

export default {
  BROWSE: {
    ...socialgraph('browse'),
    RESET: 'SOCIALGRAPH_BROWSE_RESET',
  },
  FOLLOW: socialgraph('follow'),
  UNFOLLOW: socialgraph('unfollow'),
  BLOCK: socialgraph('block'),
  UNBLOCK: socialgraph('unblock'),
};
