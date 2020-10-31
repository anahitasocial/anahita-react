import _ from 'lodash';

const editItem = (list, item, defaultItem) => {
  const items = { ...list };
  items.byId[item.id] = item;
  items.allIds = _.union(items.allIds, [item.id]);
  items.current = {
    ...defaultItem,
    ...item,
  };

  return items;
};

const deleteItem = (list, item, defaultItem) => {
  const items = { ...list };
  _.unset(items.byId, item.id);
  _.remove(items.allIds, (n) => {
    return n === item.id;
  });
  items.current = { ...defaultItem };

  return items;
};

export default {
  editItem,
  deleteItem,
};
