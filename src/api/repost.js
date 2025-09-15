import axios from 'axios';

const browse = (params) => {
  const { node } = params;
  return axios.get(`/reposts/${node.id}/`, { params });
};

const add = (node) => {
  const { id: parentId } = node;
  return axios.post(`/reposts/${parentId}/`);
};

const deleteItem = (repost) => {
  const { id } = repost;
  return axios.delete(`/reposts/${id}`);
};

export default {
  browse,
  add,
  deleteItem,
};
