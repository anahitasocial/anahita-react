import axios from 'axios';

const browse = (params) => {
  const { node, comment } = params;
  const path = comment && comment.id > 0 ? `/likes/${comment.id}/` : `/likes/${node.id}/`;
  return axios.get(path, { params });
};

const add = (node, comment = null) => {
  const path = comment && comment.id > 0 ? `/likes/${comment.id}/` : `/likes/${node.id}/`;
  return axios.post(path);
};

const deleteItem = (node, comment = null) => {
  const path = comment && comment.id > 0 ? `/likes/${comment.id}/` : `/likes/${node.id}/`;
  return axios.delete(path);
};

export default {
  browse,
  add,
  deleteItem,
};
