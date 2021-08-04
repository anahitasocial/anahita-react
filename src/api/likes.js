import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

const browse = (node, comment = null) => {
  const namespace = utils.node.getNamespace(node);
  let url = `/${namespace}/${node.id}.json?get=voters&avatar=1`;

  if (comment) {
    url += `&cid=${comment.id}`;
  }

  return axios.get(url);
};

const add = (node, comment = null) => {
  const namespace = utils.node.getNamespace(node);
  let url = `/${namespace}/${node.id}.json`;
  let action = 'vote';

  if (comment) {
    url += `?cid=${comment.id}`;
    action += 'comment';
  }

  return axios.post(url, constructFormData({ action }));
};

const deleteItem = (node, comment = null) => {
  const namespace = utils.node.getNamespace(node);
  let url = `/${namespace}/${node.id}.json`;
  let action = 'unvote';

  if (comment) {
    url += `?cid=${comment.id}`;
    action += 'comment';
  }

  return axios.post(url, constructFormData({ action }));
};

export default {
  browse,
  add,
  deleteItem,
};
