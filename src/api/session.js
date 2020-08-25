import axios from 'axios';

const read = () => {
  return axios.get('/people/session.json');
};

const add = (credentials) => {
  return axios.post('/people/session.json', credentials);
};

const deleteItem = () => {
  return axios.delete('/people/session.json');
};

export default {
  read,
  add,
  deleteItem,
};
