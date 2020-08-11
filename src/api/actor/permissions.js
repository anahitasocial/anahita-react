import axios from 'axios';
import { constructURLSearchParams } from '../utils';

const read = (namespace) => {
  return (actor) => {
    return axios.get(`/${namespace}/${actor.id}/permissions.json`);
  };
};

/*
action: setprivacy

access: followers
allowFollowRequest: 1

privacy_name[]: access
privacy_name[]: com_photos:photo:add
com_photos:photo:add: mutuals
privacy_name[]: com_photos:photo:addcomment
com_photos:photo:addcomment: followers
privacy_name[]: com_photos:set:add
com_photos:set:add: followers
privacy_name[]: com_photos:set:addcomment
com_photos:set:addcomment: followers
action: setprivacy
privacy_name[]: com_notes:note:add
com_notes:note:add: mutuals
privacy_name[]: com_notes:note:addcomment
com_notes:note:addcomment: followers
*/

const edit = (namespace) => {
  return (params) => {
    const {
      actor,
      access,
      allowFollowRequest,
      privacies,
    } = params;

    return axios.post(`/${namespace}/${actor.id}.json`, constructURLSearchParams({
      action: 'setprivacy',
      access,
      allowFollowRequest,
      privacies,
    }));
  };
};

export default (namespace) => {
  return {
    browse: read(namespace),
    edit: edit(namespace),
  };
};
