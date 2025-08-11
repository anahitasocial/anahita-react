import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

function add(node) {
  return axios.post('/notifications/subscriptions', constructFormData({
    target_id: node.id,
  }));
}

function deleteItem(node) {
  return axios.delete(`/notifications/subscriptions/${node.id}`);
}

export default {
  add,
  deleteItem,
};
