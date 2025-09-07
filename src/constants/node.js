export default {
  TYPES: {
    ACTOR: [
      'node.actor.group-service.group.v1',
      'node.actor.person-service.person.v1',
    ],
    MEDIUM: [
      'node.medium.article-service.article.v1',
      'node.medium.document-service.document.v1',
      'node.medium.note-service.note.v1',
      'node.medium.topic-service.topic.v1',
      'node.medium.photo-service.photo.v1',
      'node.medium.photo-service.photo-set.v1',
      'node.medium.todo-service.todo.v1',
      'node.medium.todo-service.todo.v1',
    ],
    FEED: [
      'node.base.feed-service.repost.v1',
    ],
  },
  SERVICES: {
    ACTOR: [
      'group-service',
      'person-service',
    ],
    MEDIUM: [
      'article-service',
      'document-service',
      'note-service',
      'topic-service',
      'photo-service',
      'todo-service',
    ],
  },
};
