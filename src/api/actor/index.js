import addfollowers from './addfollowers';
import admins from './admins';
import apps from './apps';
import followrequests from './followrequests';
import notifications from './notifications';
import permissions from './permissions';
import privacy from './privacy';

export default (namespace) => {
  return {
    addfollowers: addfollowers(namespace),
    admins: admins(namespace),
    apps: apps(namespace),
    followrequests: followrequests(namespace),
    notifications: notifications(namespace),
    permissions: permissions(namespace),
    privacy: privacy(namespace),
  };
};
