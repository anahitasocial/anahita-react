import axios from 'axios';

function browse(person) {
  return axios.get(`auth-logs/${person.id}`);
}

function deleteItem(person, authLog) {
  return axios.delete(`auth-logs/${person.id}/${authLog.id}`);
}

export default {
  browse,
  deleteItem,
};
