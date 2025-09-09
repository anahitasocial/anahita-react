import axios from 'axios';

const add = (node) => {
  return axios.post(`/feeds/reposts/${node.id}/`);
};

const deleteItem = (node) => {
  return axios.delete(`/feeds/reposts/${node.id}/`);
};

export default {
  add,
  deleteItem,
};
