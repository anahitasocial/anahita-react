import axios from 'axios';
import qs from 'qs';

const browse = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/permissions.json`);
  };
};

const edit = (namespace) => {
  return (params) => {
    const {
      actor,
      actions,
    } = params;

    return axios.post(`/${namespace}/${actor.id}.json`, qs.stringify({
      action: 'setpermission',
      privacy_name: Object.keys(actions),
      ...actions,
    }));
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    edit: edit(namespace),
  };
};
