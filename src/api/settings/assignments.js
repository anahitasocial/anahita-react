import axios from 'axios';
import { constructFormData } from '../utils';

const browse = (params) => {
  return axios.get('/settings/assignments.json', { params });
};

const edit = (assignment) => {
  return axios.post('/settings/assignment.json', constructFormData({
    ...assignment,
    action: 'edit',
  }));
};

export default {
  browse,
  edit,
};
