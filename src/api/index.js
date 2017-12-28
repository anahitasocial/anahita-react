import axios from 'axios';
import * as auth from './auth'

// @todo move this to webpack.config.prod and webpack.config.dev files
//axios.defaults.baseURL = "https://www.GetAnahita.com"
axios.defaults.baseURL = "http://localhost";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  const headers = Object.assign({}, config.headers)
  return Object.assign({}, config, { headers })
}, error => Promise.reject(error));

export {
  auth
};
