import axios from 'axios';

const edit = (namespace) => {
  return (node) => {
    const { openToComment } = node;
    return axios.post(`/${namespace}/${node.id}.json`, {
      action: 'commentstatus',
      status: openToComment ? 1 : 0,
    });
  };
};

export default (namespace) => {
  return {
    edit: edit(namespace),
  };
};
