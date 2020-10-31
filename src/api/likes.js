import axios from 'axios';
import utils from '../utils';
import CommentDefault from '../proptypes/CommentDefault';

const { constructFormData } = utils.api;

const browse = (node, comment = CommentDefault) => {
  const namespace = node.objectType.split('.')[1];
  let url = `/${namespace}/${node.id}.json?get=voters&avatar=1`;

  if (comment) {
    url += `&cid=${comment.id}`;
  }

  return axios.get(url);
};

const add = (node, comment = CommentDefault) => {
  const namespace = node.objectType.split('.')[1];
  let url = `/${namespace}/${node.id}.json`;
  let action = 'vote';

  if (comment.id) {
    url += `?cid=${comment.id}`;
    action += 'comment';
  }

  return axios.post(url, constructFormData({ action }));
};

const deleteItem = (node, comment = CommentDefault) => {
  const namespace = node.objectType.split('.')[1];
  let url = `/${namespace}/${node.id}.json`;
  let action = 'unvote';

  if (comment.id) {
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
