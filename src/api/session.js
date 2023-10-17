import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const read = () => {
  return axios.get('/whoami');
};

const add = (credentials) => {
  const { username, password } = credentials;
  return axios.post('/auth/', constructFormData({
    identifier: username,
    password,
  }));
};

const deleteItem = () => {
  return axios.delete('/auth/');
};

export default {
  read,
  add,
  deleteItem,
};
