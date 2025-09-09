import axios from 'axios';

function browse(params) {
  const { id } = params;
  return axios.get(`/feeds/actor/${id}/`, { params });
}

export default {
  browse,
};
