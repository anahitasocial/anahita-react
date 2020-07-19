import {
  shape,
  number,
  string,
  arrayOf,
  objectOf,
  oneOfType,
  bool,
  any,
} from 'prop-types';

export default shape({
  id: number,
  name: string,
  enabled: bool,
  ordering: number,
  meta: oneOfType([
    objectOf(any),
    arrayOf(any),
  ]),
});
