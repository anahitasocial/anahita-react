import { Person as PERSON } from '../constants';

const canAdd = (viewer) => {
  if ([
    PERSON.TYPE.SUPER_ADMIN,
    PERSON.TYPE.ADMIN,
  ].includes(viewer.usertype)) {
    return true;
  }

  return false;
};

const canFollow = (isAuthenticated, viewer, actor) => {
  return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
};

export default {
  canAdd,
  canFollow,
};
