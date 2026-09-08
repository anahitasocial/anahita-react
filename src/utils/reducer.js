import _ from 'lodash';

// The shape every list slice has. Defaulted here because a parent can be
// written to before anything has browsed it — tagging a location adds to a
// slice the gadget never fills in, and `{ ...undefined }.byId` is undefined,
// which threw before the add could resolve.
const emptyList = () => {
  return {
    byId: {},
    allIds: [],
  };
};

const editItem = (list, item, defaultItem) => {
  const items = {
    ...emptyList(),
    ...list,
  };

  // Replaced, not written through. The spread above is shallow, so byId and
  // allIds were still the previous state's own objects and both helpers
  // edited them in place — mutating the state redux had already handed out.
  items.byId = {
    ...items.byId,
    [item.id]: item,
  };
  items.allIds = _.union(items.allIds, [item.id]);
  items.current = {
    ...defaultItem,
    ...item,
  };

  return items;
};

const deleteItem = (list, item, defaultItem) => {
  const items = {
    ...emptyList(),
    ...list,
  };

  items.byId = _.omit(items.byId, [item.id]);
  items.allIds = items.allIds.filter((id) => {
    return id !== item.id;
  });
  items.current = { ...defaultItem };

  return items;
};

export default {
  editItem,
  deleteItem,
};
