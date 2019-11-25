import axios from 'axios';
import { constructURLSearchParams } from './utils';

const edit = (namespace) => {
  return (node) => {
    const { openToComment } = node;
    return axios.post(`/${namespace}/${node.id}.json`, constructURLSearchParams({
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
