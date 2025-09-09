import axios from 'axios';

function browse(params) {
  return axios.get('/feeds/leaders/', { params });
}

export default {
  browse,
};
