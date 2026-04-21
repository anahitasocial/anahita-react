import axios from 'axios';

const browse = () => {
  return axios.get('/clients');
};

const read = (id) => {
  return axios.get(`/clients/${id}`);
};

const add = (client) => {
  return axios.post('/clients', client);
};

const edit = (client) => {
  return axios.patch(`/clients/${client.id}`, client);
};

const deleteItem = (id) => {
  return axios.delete(`/clients/${id}`);
};

export default {
  browse,
  read,
  add,
  edit,
  deleteItem,
};
