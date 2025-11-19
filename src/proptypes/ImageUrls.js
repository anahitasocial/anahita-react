import {
  shape,
  number,
  string,
} from 'prop-types';

const ImageType = shape({
  size: shape({
    width: number,
    height: number,
  }),
  url: string,
});

export default shape({
  large: ImageType,
  medium: ImageType,
  original: ImageType,
});
