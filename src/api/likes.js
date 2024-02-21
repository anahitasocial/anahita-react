import axios from 'axios';

const browse = (node, comment = null) => {
  const path = comment && comment.id > 0 ? `/likes/${comment.id}/?limit=1000` : `/likes/${node.id}/?limit=1000`;
  return axios.get(path);
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
