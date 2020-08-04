import {
  shape,
  number,
  string,
  object,
  array,
  arrayOf,
  oneOf,
  bool,
  oneOfType,
} from 'prop-types';

const AssignmentApp = shape({
  id: number,
  name: string,
  options: oneOfType([object, array]),
  selected: oneOf([
    'optional',
    'always',
    'never',
  ]),
  access: number,
  is_optional: bool,
});

export default shape({
  identifier: string,
  apps: arrayOf(AssignmentApp),
});
