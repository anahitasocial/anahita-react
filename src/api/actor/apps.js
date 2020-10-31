import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const browse = (namespace) => {
  return (actor) => {
    const { id } = actor;
    return axios.get(`/${namespace}/${id}/apps.json`);
  };
};

/*
*  @action: string { addapp, removeapp }
*  @component: string com_articles, com_todos, ...
*/

const edit = (namespace) => {
  return (params) => {
    const {
      app,
      actor,
    } = params;
    const action = app.enabled ? 'removeapp' : 'addapp';

    return axios.post(`/${namespace}/${actor.id}.json`, constructFormData({
      action,
      app: app.id,
    }));
  };
};

export default (namespace) => {
  return {
    browse: browse(namespace),
    edit: edit(namespace),
  };
};
