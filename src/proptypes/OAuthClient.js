import {
  shape,
  number,
  string,
  arrayOf,
  bool,
} from 'prop-types';

export default shape({
  id: number,
  clientId: string,
  name: string,
  redirectUris: arrayOf(string),
  grantTypes: arrayOf(string),
  scopes: arrayOf(string),
  tokenExpiry: number,
  confidential: bool,
  active: bool,
  createTime: string,
  updateTime: string,
});
