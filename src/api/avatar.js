import axios from 'axios';
import utils from '../utils';

const edit = (node, file) => {
  const namespace = utils.node.getNamespace(node);
  const { id } = node;
  const formData = new FormData();

  if (!file) {
    const newFile = new File([], '');
    formData.append('portrait', newFile);
  } else {
    formData.append('portrait', file);
  }

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return axios.post(`/${namespace}/${id}.json?edit=avatar`, formData, config);
};

export default { edit };
