import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function add(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, constructFormData({
    action: 'subscribe',
  }));
}

function deleteItem(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, constructFormData({
    action: 'unsubscribe',
  }));
}

export default {
  add,
  deleteItem,
};
