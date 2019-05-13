import createReducer from './create';
import DEFAULT_HASHTAG from '../proptypes/HashtagDefault';

export default (state, action) => {
  return createReducer('hashtags', DEFAULT_HASHTAG)(state, action);
};
