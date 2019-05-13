import axios from 'axios';
import actors from './actors';
import avatar from './avatar';
import auth from './auth';
import comments from './comments';
import cover from './cover';
import hashtags from './hashtags';
import likes from './likes';
import media from './media';
import node from './node';
import notifications from './notifications';
import person from './person';
import socialgraph from './socialgraph';
import stories from './stories';

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
  comments,
  cover,
  hashtags,
  likes,
  media,
  node,
  notifications,
  person,
  socialgraph,
  stories,
};
