import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const browse = (params) => {
  const {
    node,
    start,
    limit,
    sort,
  } = params;

  const path = `/comments/${node.id}/`;
  return axios.get(path, {
    params: {
      start,
      limit,
      sort,
    },
  });
};

const read = (cid, node) => {
  const path = `/comments/${node.id}/comments/${cid}`;
  return axios.get(path);
};

const edit = (comment) => {
  const { id, parentId, body } = comment;
  const path = `/comments/${parentId}/${id}`;
  return axios.patch(path, constructFormData({
    body,
  }));
};

const add = (comment) => {
  const { body, parent } = comment;
  const path = `/comments/${parent.id}/`;
  return axios.post(path, constructFormData({
    body,
  }));
};

const deleteItem = (comment) => {
  const { id, parent } = comment;
  const path = `/comments/${parent.id}/${id}`;
  return axios.delete(path);
};

export default {
  browse,
  read,
  edit,
  add,
  deleteItem,
};
