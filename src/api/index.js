import axios from 'axios';
import * as actors from './actors';
import * as avatar from './avatar';
import * as auth from './auth';
import * as cover from './cover';
import * as likes from './likes';
import * as media from './media';
import * as node from './node';
import * as notifications from './notifications';
import * as person from './person';
import * as socialgraph from './socialgraph';
import * as stories from './stories';

// @todo move this to webpack.config.prod and webpack.config.dev files
// axios.defaults.baseURL = "https://www.GetAnahita.com"
axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const headers = { ...config.headers };
  return {
    ...config,
    ...{ headers },
  };
}, (error) => { return Promise.reject(error); });

export {
  actors,
  avatar,
  auth,
  cover,
  likes,
  media,
  node,
  notifications,
  person,
  socialgraph,
  stories,
};
