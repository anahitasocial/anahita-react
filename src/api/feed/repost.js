import axios from 'axios';

const browse = (params) => {
  const { node } = params;
  return axios.get(`/reposts/${node.id}/`, { params });
};

const add = (node) => {
  const { id: parentId } = node;
  return axios.post(`/reposts/${parentId}/`);
};

const deleteItem = (node) => {
  const { id: parentId } = node;
  return axios.delete(`/reposts/${parentId}/`);
};

export default {
  browse,
  add,
  deleteItem,
};
