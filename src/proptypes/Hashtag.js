import {
  shape,
  number,
  string,
  oneOf,
} from 'prop-types';

export default shape({
  id: number,
  objectType: oneOf(['com.hashtags.hashtag']),
  alias: string,
  name: string,
  creationTime: string,
  updateTime: string,
});
