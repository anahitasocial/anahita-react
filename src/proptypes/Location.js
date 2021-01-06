import {
  shape,
  number,
  string,
  arrayOf,
} from 'prop-types';

import PersonType from './Person';

export default shape({
  id: number,
  objectType: string,
  name: string,
  alias: string,
  body: string,
  author: PersonType,
  creationTime: string,
  editor: PersonType,
  updateTime: string,
  latitude: number,
  longitude: number,
  commands: arrayOf(string),
  address: string,
  city: string,
  state_province: string,
  country: string,
});
