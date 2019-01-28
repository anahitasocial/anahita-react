import { pluralize } from 'inflection';

export function getAuthor(entity) {
  return entity.author || {
    id: null,
    name: 'Unknown',
    givenName: '?',
    familyName: '?',
    objectType: 'com.people.person',
    imageURL: '',
  };
}

export function getURL(entity) {
  if (entity.objectType) {
    const namespace = pluralize(entity.objectType.split('.')[2]);
    let identifier = null;

    if (namespace === 'people') {
      identifier = entity.alias;
    } else if (entity.alias) {
      identifier = `${entity.id}-${entity.alias}`;
    } else {
      identifier = entity.id;
    }
    return `/${namespace}/${identifier}/`;
  }

  return '';
}

export function getPortraitURL(entity) {
  return entity.imageURL && entity.imageURL.medium && entity.imageURL.medium.url;
}

export function getCoverURL(entity) {
  return entity.coverURL && entity.coverURL.medium && entity.coverURL.medium.url;
}

export function getActorInitials(actor) {
  const namespace = actor.objectType.split('.')[1];
  if (namespace === 'people') {
    return `${actor.givenName.charAt(0).toUpperCase()}${actor.familyName.charAt(0).toUpperCase()}`;
  }

  return actor.name.charAt(0).toUpperCase();
}
