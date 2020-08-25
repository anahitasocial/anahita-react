import axios from 'axios';

function add(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, {
    action: 'subscribe',
  });
}

function deleteItem(node) {
  const namespace = node.objectType.split('.')[1];
  return axios.post(`/${namespace}/${node.id}.json`, {
    action: 'unsubscribe',
  });
}

export default {
  add,
  deleteItem,
};
