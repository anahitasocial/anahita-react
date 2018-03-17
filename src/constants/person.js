import async from './async';

const person = async('person');
export default {
  READ: person('read'),
  EDIT: person('edit'),
  ADD: person('add'),
  DELETE: person('delete'),
};
