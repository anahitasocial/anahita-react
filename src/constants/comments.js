import async from './async';

const comments = async('comments');

export default {
  BROWSE: {
    ...comments('browse'),
    SET: 'COMMENTS_BROWSE_SET',
    RESET: 'COMMENTS_BROWSE_RESET',
  },
  READ: comments('read'),
  EDIT: comments('edit'),
  ADD: comments('add'),
  DELETE: comments('delete'),
  FIELDS: {
    BODY: {
      MAX_LENGTH: 5000,
    },
  },
};
