import access from './access';
import addFollowers from './addFollowers';
import admins from './admins';
import deletionCounts from './deletionCounts';
import features from './features';
import lifecycle from './lifecycle';
import followRequests from './followRequests';
import notifications from './notifications';

export default (namespace) => {
  return {
    access: access(namespace),
    addFollowers,
    admins: admins(namespace),
    deletionCounts: deletionCounts(namespace),
    features: features(namespace),
    lifecycle: lifecycle(namespace),
    followRequests,
    notifications: notifications(namespace),
  };
};
