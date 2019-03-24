import async from './async';

const notifications = async('notifications');

export default {
  ADD: notifications('add'),
  DELETE: notifications('delete'),
};
