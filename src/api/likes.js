import axios from 'axios';
import { constructURLSearchParams } from './utils';

function browse(node) {
  const component = node.objectType.split('.')[1];
  return axios.get(`/${component}/${node.id}.json?get=voters&avatar=1`);
}

function add(node) {
  const component = node.objectType.split('.')[1];
  return axios.post(`/${component}/${node.id}.json`, constructURLSearchParams({
    action: 'vote',
  }));
}

function deleteLike(node) {
  const component = node.objectType.split('.')[1];
  return axios.post(`/${component}/${node.id}.json`, constructURLSearchParams({
    action: 'unvote',
  }));
}

export {
  browse,
  add,
  deleteLike,
};
