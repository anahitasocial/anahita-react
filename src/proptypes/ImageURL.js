import {
  shape,
  number,
  string,
} from 'prop-types';

export default shape({
  large: shape({
    size: shape({
      width: number,
      height: number,
    }),
    url: string,
  }),
  medium: shape({
    size: shape({
      width: number,
      height: number,
    }),
    url: string,
  }),
  original: shape({
    size: shape({
      width: number,
      height: number,
    }),
    url: string,
  }),
});
