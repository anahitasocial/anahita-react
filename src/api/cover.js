import axios from 'axios';
import utils from '../utils';

const edit = (node, file) => {
  const namespace = utils.node.getNamespace(node);
  const { id } = node;
  const formData = new FormData();

  if (!file) {
    const newFile = new File([], '');
    formData.append('cover', newFile);
  } else {
    formData.append('cover', file);
  }

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  return axios.post(`/${namespace}/${id}.json?edit=cover`, formData, config);
};

export default { edit };
