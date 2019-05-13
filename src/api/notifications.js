import axios from 'axios';
import { constructURLSearchParams } from './utils';


function add(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, constructURLSearchParams({
    action: 'subscribe',
  }));
}

function deleteItem(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, constructURLSearchParams({
    action: 'unsubscribe',
  }));
}

export default {
  add,
  deleteItem,
};
