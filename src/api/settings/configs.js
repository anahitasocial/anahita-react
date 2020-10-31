/* eslint camelcase: "off" */
import axios from 'axios';
import utils from '../../utils';

const { constructFormData } = utils.api;

const read = () => {
  return axios.get('/settings/config.json');
};

const edit = (configs) => {
  const {
    sef_rewrite,
    debug,
    smtpauth,
  } = configs;
  return axios.post('/settings/config.json', constructFormData({
    action: 'edit',
    ...configs,
    sef_rewrite: sef_rewrite ? 1 : 0,
    debug: debug ? 1 : 0,
    smtpauth: smtpauth ? 1 : 0,
  }));
};

export default {
  read,
  edit,
};
