import axios from 'axios';

const read = (node) => {
  const namespace = node.objectType.split('.')[1];
  return axios.get(`/${namespace}/${node.id}.json`);
};

const deleteItem = (node) => {
  const namespace = node.objectType.split('.')[1];
  return axios.delete(`/${namespace}/${node.id}.json`);
};

export default {
  read,
  deleteItem,
};
