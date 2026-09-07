import access from './access';
import addfollowers from './addfollowers';
import admins from './admins';
import deletioncounts from './deletioncounts';
import features from './features';
import lifecycle from './lifecycle';
import followrequests from './followrequests';
import notifications from './notifications';

export default (namespace) => {
  return {
    access: access(namespace),
    addfollowers,
    admins: admins(namespace),
    deletioncounts: deletioncounts(namespace),
    features: features(namespace),
    lifecycle: lifecycle(namespace),
    followrequests,
    notifications: notifications(namespace),
  };
};
