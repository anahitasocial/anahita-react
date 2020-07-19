import {
  shape,
  number,
  string,
  arrayOf,
  objectOf,
  bool,
  any,
  oneOfType,
} from 'prop-types';

export default shape({
  id: number,
  name: string,
  enabled: bool,
  ordering: number,
  type: string,
  element: string,
  meta: oneOfType([
    objectOf(any),
    arrayOf(any),
  ]),
});
