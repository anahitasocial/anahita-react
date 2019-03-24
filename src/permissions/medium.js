import { Person as PERSON } from '../constants';

const canEdit = (viewer, medium) => {
  if ([
    PERSON.TYPE.SUPER_ADMIN,
    PERSON.TYPE.ADMIN,
  ].includes(viewer.usertype)) {
    return true;
  }

  if (medium.owner.id === viewer.id) {
    return true;
  }

  if (medium.author.id === viewer.id) {
    return true;
  }

  return false;
};

const canAdd = (viewer) => {
  if ([
    PERSON.TYPE.SUPER_ADMIN,
    PERSON.TYPE.ADMIN,
  ].includes(viewer.usertype)) {
    return true;
  }

  return false;
};

const canDelete = (viewer, medium) => {
  if ([
    PERSON.TYPE.SUPER_ADMIN,
    PERSON.TYPE.ADMIN,
  ].includes(viewer.usertype)) {
    return true;
  }

  if (medium.owner.id === viewer.id) {
    return true;
  }

  return false;
};

export default {
  canAdd,
  canEdit,
  canDelete,
};
