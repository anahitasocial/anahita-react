import axios from 'axios';
import * as actors from './actors';
import * as auth from './auth';
import * as media from './media';
import * as person from './person';
import * as socialgraph from './socialgraph';
import * as stories from './stories';

// @todo move this to webpack.config.prod and webpack.config.dev files
// axios.defaults.baseURL = "https://www.GetAnahita.com"
axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const headers = Object.assign({}, config.headers);
  return Object.assign({}, config, { headers });
}, (error) => { return Promise.reject(error); });

export {
  actors,
  auth,
  media,
  person,
  socialgraph,
  stories,
};
