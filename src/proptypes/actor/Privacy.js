import {
  shape,
  string,
  bool,
} from 'prop-types';

export default shape({
  allowFollowRequest: bool,
  access: string,
  'leadable:add': string,
});
