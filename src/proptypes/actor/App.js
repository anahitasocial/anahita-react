import {
  shape,
  string,
  bool,
} from 'prop-types';

export default shape({
  id: string,
  name: string,
  enabled: bool,
  description: string,
});
