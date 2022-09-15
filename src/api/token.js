import axios from 'axios';

const read = (token) => {
  return axios.get('/people/session.json', {
    params: {
      token,
    },
  });
};

export default {
  read,
};
