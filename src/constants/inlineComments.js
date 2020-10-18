import async from './async';

const comments = async('inline_comments');

export default {
  BROWSE: {
    ...comments('browse'),
    SET: 'INLINE_COMMENTS_BROWSE_SET',
    RESET: 'INLINE_COMMENTS_BROWSE_RESET',
  },
  READ: comments('read'),
  EDIT: comments('edit'),
  ADD: comments('add'),
  DELETE: comments('delete'),
};
