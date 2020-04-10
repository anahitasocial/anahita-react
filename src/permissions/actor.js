import { Person as PERSON } from '../constants';

const { ADMIN, SUPER_ADMIN } = PERSON.FIELDS.TYPE;

const canAdd = (viewer) => {
  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
    return true;
  }

  return false;
};

const canEdit = (viewer, actor) => {
  if (viewer.id === actor.id) {
    return true;
  }

  if (actor.administratorIds) {
    if (actor.administratorIds.indexOf(String(viewer.id)) > -1) {
      return true;
    }
  }

  if ([ADMIN, SUPER_ADMIN].includes(viewer.usertype)) {
    return true;
  }

  return false;
};

const canFollow = (isAuthenticated, viewer, actor) => {
  return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
};

export default {
  canAdd,
  canEdit,
  canFollow,
};
