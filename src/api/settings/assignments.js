import axios from 'axios';

const browse = (params) => {
  return axios.get('/settings/assignments.json', { params });
};

const edit = (assignment) => {
  return axios.post('/settings/assignment.json', {
    ...assignment,
    action: 'edit',
  });
};

export default {
  browse,
  edit,
};
