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
  'com.articles.article',
  'com.todos.todo',
];

const isActor = (node) => {
  return node.objectType ? actorObjectTypes.includes(node.objectType) : false;
};

const isMedium = (node) => {
  return node.objectType ? mediumObjectTypes.includes(node.objectType) : false;
};

const isComment = (node) => {
  return node.objectType.split('.')[2] === 'comment';
};

export default {
  isActor,
  isMedium,
  isComment,
};
