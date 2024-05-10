import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

function browse(params) {
  return axios.get('/notifications/?', {
    params,
  });
}

function add(node) {
  return axios.post('/notifications/subscriptions', constructFormData({
    target_id: node.id,
  }));
}

function deleteItem(node) {
  return axios.delete(`/notifications/subscriptions/${node.id}`);
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
