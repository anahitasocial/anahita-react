import axios from 'axios';
import { constructURLSearchParams } from './utils';

const browse = (node) => {
  const namespace = node.objectType.split('.')[1];
  return axios.get(`/${namespace}/${node.id}.json?`);
};

function read(cid, node) {
  const namespace = node.objectType.split('.')[1];
  return axios.get(`/${namespace}/${node.id}.json?cid=${cid}`);
}

function edit(comment, node) {
  const namespace = node.objectType.split('.')[1];
  const { id, body } = comment;
  return axios.post(`/${namespace}/${node.id}.json?cid=${id}`, constructURLSearchParams({
    action: 'editcomment',
    body,
  }));
}

function add(comment, node) {
  const namespace = node.objectType.split('.')[1];
  const { body } = comment;
  return axios.post(`/${namespace}/${node.id}.json?`, constructURLSearchParams({
    action: 'addcomment',
    body,
  }));
}

function deleteItem(comment, node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json?cid=${comment.id}`, constructURLSearchParams({
    action: 'deletecomment',
  }));
}

export {
  browse,
  read,
  edit,
  add,
  deleteItem,
};
