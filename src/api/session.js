import axios from 'axios';
import { constructURLSearchParams } from './utils';

const read = () => {
  return axios.get('/people/session.json');
};

const add = (credentials) => {
  return axios.post('/people/session.json', constructURLSearchParams(credentials));
};

const deleteItem = () => {
  return axios.delete('/people/session.json');
};

export default {
  read,
  add,
  deleteItem,
};
