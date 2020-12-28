import { Person as PERSON } from '../constants';

const { ADMIN, SUPER_ADMIN } = PERSON.FIELDS.TYPE;

const canEdit = (viewer, medium) => {
  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
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

const canAdd = (viewer, owner) => {
  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
    return true;
  }

  if (viewer.id === owner.id) {
    return true;
  }

  return false;
};

const canDelete = (viewer, medium) => {
  if ([SUPER_ADMIN, ADMIN].includes(viewer.usertype)) {
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
