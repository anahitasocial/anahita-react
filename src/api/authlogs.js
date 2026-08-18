import axios from 'axios';

function browse(person) {
  return axios.get(`authlogs/${person.id}`);
}

function deleteItem(person, authlog) {
  return axios.delete(`authlogs/${person.id}/${authlog.id}`);
}

export default {
  browse,
  deleteItem,
};
