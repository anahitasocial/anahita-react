import async from './async';

const comments = async('comments');

export default {
  BROWSE: {
    ...comments('browse'),
    RESET: 'COMMENTS_BROWSE_RESET',
  },
  READ: comments('read'),
  EDIT: comments('edit'),
  ADD: comments('add'),
  DELETE: comments('delete'),
};
