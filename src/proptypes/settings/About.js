import {
  shape,
  string,
} from 'prop-types';

export default shape({
  title: string,
  version: string,
  license: shape({
    name: string,
    url: string,
  }),
  website: shape({
    name: string,
    url: string,
  }),
});
