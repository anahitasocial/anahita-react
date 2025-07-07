import { Person as PERSON } from '../constants';

const { SUPER_ADMIN } = PERSON.FIELDS.USERTYPE;

const canEdit = (viewer) => {
  return viewer.usertype === SUPER_ADMIN;
};

export default {
  canEdit,
};
