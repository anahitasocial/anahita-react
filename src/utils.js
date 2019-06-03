const actorObjectTypes = [
  'com.actors.actor',
  'com.groups.group',
  'com.people.person',
];

const mediumObjectTypes = [
  'com.notes.note',
  'com.topics.topic',
  'com.photos.photo',
  'com.photos.set',
  'com.articles.aritcle',
  'com.todos.todo',
];

const isActor = (node) => {
  return node.objectType ? actorObjectTypes.includes(node.objectType) : false;
};

const isMedium = (node) => {
  return node.objectType ? mediumObjectTypes.includes(node.objectType) : false;
};

export default {
  isActor,
  isMedium,
};
