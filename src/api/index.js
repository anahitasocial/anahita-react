import axios from 'axios';

// @todo move this to webpack.config.prod and webpack.config.dev files
const serverApp = "https://www.GetAnahita.com"

axios.interceptors.request.use(config => {
  const headers = Object.assign({}, config.headers);
  return Object.assign({}, config, { headers });
}, error => Promise.reject(error));

export function logout() {
  return axios.delete(serverApp + '/people/session/');
}

export function login(username, password) {
  return axios.post(serverApp + '/people/session/', {
    username,
    password,
  });
}
