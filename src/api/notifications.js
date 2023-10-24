import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function browse(params) {
  return axios.get('/notifications/?', {
    params,
  });
}

function add(node) {
  const namespace = utils.node.getNamespace(node);
  return axios.post(`/${namespace}/${node.id}`, constructFormData({
    action: 'subscribe',
  }));
}

function deleteItem(node) {
  const namespace = utils.node.getNamespace(node);
  return axios.post(`/${namespace}/${node.id}`, constructFormData({
    action: 'unsubscribe',
  }));
}

function count() {
  return axios.get('/notifications/unreadcount');
}

export default {
  browse,
  add,
  deleteItem,
  count,
};
