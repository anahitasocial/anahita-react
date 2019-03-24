import axios from 'axios';
import { constructURLSearchParams } from './utils';

function browse(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.get(`/${namespace}/${node.id}.json?get=voters&avatar=1`);
}

function add(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, constructURLSearchParams({
    action: 'vote',
  }));
}

function deleteItem(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, constructURLSearchParams({
    action: 'unvote',
  }));
}

export {
  browse,
  add,
  deleteItem,
};
