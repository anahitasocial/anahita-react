import apis from '../api';
import { CommentsInline as COMMENTS_INLINE } from '../constants';
import likes from './likes';
import createAction from './create';

// --- setList

const setList = () => {
  return (comments, parent) => {
    return {
      type: COMMENTS_INLINE.BROWSE.SET,
      comments,
      parent,
    };
  };
};

export default {
  setList: setList(),
  ...createAction('comments_inline')(apis.comments),
  likes: likes('comments_inline')(apis.likes),
};
