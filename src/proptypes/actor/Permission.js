import {
  shape,
  number,
  string,
  bool,
  objectOf,
  any,
} from 'prop-types';

export default shape({
  id: number,
  name: string,
  description: string,
  enabled: bool,
  actions: objectOf(any),
});
