import _ from 'lodash';

const editItem = (list, item) => {
  const items = { ...list };
  items.byId[item.id] = item;
  items.allIds = _.union(items.allIds, [item.id]);
  items.current = item;

  return items;
};

const deleteItem = (list, item) => {
  const items = { ...list };
  _.unset(items.byId, item.id);
  items.allIds = _.remove(items.allIds, (n) => {
    return n !== item.id;
  });

  return items;
};

export default {
  editItem,
  deleteItem,
};
