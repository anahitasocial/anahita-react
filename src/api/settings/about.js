import axios from 'axios';

const read = () => {
  return axios.get('/settings/about.json');
};

export default {
  read,
};
