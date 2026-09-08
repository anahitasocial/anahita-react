import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

// Comment status has its own route, like access: PATCH /{namespace}/{id}/commentstatus.
// The monolith's POST /{namespace}/{id} with action=commentstatus has no route
// in the services stack and answered 405.
const edit = (namespace) => {
  return (node) => {
    return axios.patch(`/${namespace}/${node.id}/commentstatus`, constructFormData({
      status: node.commentStatus ? 1 : 0,
    }));
  };
};

export default (namespace) => {
  return {
    edit: edit(namespace),
  };
};
