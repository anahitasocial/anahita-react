import axios from 'axios';
import { constructURLSearchParams } from '../utils';

const browse = (params) => {
  return axios.get('/settings/assignments.json', { params });
};

const edit = (assignment) => {
  return axios.post('/settings/assignment.json', constructURLSearchParams({
    ...assignment,
    action: 'edit',
  }));
};

export default {
  browse,
  edit,
};
