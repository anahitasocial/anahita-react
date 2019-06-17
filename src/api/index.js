import axios from 'axios';
import actors from './actors';
import avatar from './avatar';
import auth from './auth';
import comments from './comments';
import cover from './cover';
import hashtags from './hashtags';
import likes from './likes';
import locations from './locations';
import media from './media';
import node from './node';
import notifications from './notifications';
import person from './person';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggables';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
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
  locations,
  media,
  node,
  notifications,
  person,
  socialgraph,
  stories,
  taggables,
};
