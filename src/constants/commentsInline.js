import async from './async';

const comments = async('comments_inline');

export default {
  BROWSE: {
    ...comments('browse'),
    SET: 'COMMENTS_INLINE_BROWSE_SET',
    RESET: 'COMMENTS_INLINE_BROWSE_RESET',
  },
  READ: comments('read'),
  EDIT: comments('edit'),
  ADD: comments('add'),
  DELETE: comments('delete'),
};
