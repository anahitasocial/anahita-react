import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const read = () => {
  return axios.get('/whoami');
};

const add = (credentials) => {
  const { username, password } = credentials;
  return axios.post('/authenticate/', constructFormData({
    identifier: username,
    password,
  }));
};

const deleteItem = () => {
  return axios.delete('/authenticate/');
};

export default {
  read,
  add,
  deleteItem,
};
