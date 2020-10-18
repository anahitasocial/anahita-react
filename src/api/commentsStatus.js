import axios from 'axios';
import { constructFormData } from './utils';

const edit = (namespace) => {
  return (node) => {
    const { openToComment } = node;
    return axios.post(`/${namespace}/${node.id}.json`, constructFormData({
      action: 'commentstatus',
      status: openToComment ? 1 : 0,
    }));
  };
};

export default (namespace) => {
  return {
    edit: edit(namespace),
  };
};
