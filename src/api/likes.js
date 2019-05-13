import axios from 'axios';
import { constructURLSearchParams } from './utils';
import CommentDefault from '../proptypes/CommentDefault';

const browse = (node) => {
  const namespace = node.objectType.split('.')[1];
  return axios.get(`/${namespace}/${node.id}.json?get=voters&avatar=1`);
};

const add = (node, comment = CommentDefault) => {
  const namespace = node.objectType.split('.')[1];
  let url = `/${namespace}/${node.id}.json`;
  let action = 'vote';

  if (comment.id) {
    url += `?cid=${comment.id}`;
    action += 'comment';
  }

  return axios.post(url, constructURLSearchParams({ action }));
};

const deleteItem = (node, comment = CommentDefault) => {
  const namespace = node.objectType.split('.')[1];
  let url = `/${namespace}/${node.id}.json`;
  let action = 'unvote';

  if (comment.id) {
    url += `?cid=${comment.id}`;
    action += 'comment';
  }

  return axios.post(url, constructURLSearchParams({ action }));
};

export default {
  browse,
  add,
  deleteItem,
};
