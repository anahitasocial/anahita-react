import axios from 'axios';

function browse(params) {
  return axios.get('/notifications/?', {
    params,
  });
}

function edit(item) {
  return axios.patch(`/notifications/${item.id}`);
}

function deleteItem(item) {
  return axios.delete(`/notifications/${item.id}`);
}

function count() {
  return axios.get('/notifications/unreadcount');
}

export default {
  browse,
  edit,
  deleteItem,
  count,
};
