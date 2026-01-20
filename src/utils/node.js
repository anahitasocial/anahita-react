import slugify from 'slugify';
import { pluralize } from 'inflection';
import countryList from 'country-list';
import i18n from '../languages';
import {
  Node as NODE,
  Person as PERSON,
} from '../constants';

const {
  REGISTERED,
  ADMIN,
  SUPER_ADMIN,
} = PERSON.FIELDS.USERTYPE;

const OWNER_NAME_CHAR_LIMIT = 16;

const {
  TYPES,
} = NODE;

const isActor = (node) => {
  return node.type ? node.type.includes('actor') : false;
};

const isPerson = (node) => {
  return node.type && node.type.includes('person');
};

const isSuperAdmin = (actor) => {
  return actor.usertype === SUPER_ADMIN;
};

const isAdmin = (actor) => {
  return [SUPER_ADMIN, ADMIN].includes(actor.usertype);
};

const isRegistered = (actor) => {
  return [SUPER_ADMIN, ADMIN, REGISTERED].includes(actor.usertype);
};

const isMedium = (node) => {
  return node.type && node.type.includes('medium');
};

const isRepost = (node) => {
  return node.type && node.type.includes('repost');
};

const isComment = (node) => {
  return node.type && node.type.includes('comment');
};

const isCommentable = (medium) => {
  return TYPES.MEDIUM.includes(medium.type);
};

const isLikeable = (medium) => {
  return TYPES.MEDIUM.includes(medium.type);
};

const isSubscribable = (medium) => {
  return TYPES.MEDIUM.includes(medium.type);
};

const isFollowable = (actor) => {
  return isActor(actor);
};

const isLeadable = (actor) => {
  return isPerson(actor);
};

const getActorInitials = (actor) => {
  if (!actor) {
    return '??';
  }

  if (actor.givenName && actor.familyName) {
    return `${actor.givenName.charAt(0).toUpperCase()}${actor.familyName.charAt(0).toUpperCase()}`;
  }

  if (actor.name) {
    return actor.name.substring(0, 2).toUpperCase();
  }

  return '??';
};

const getPersonInitials = (person) => {
  const givenName = person.givenName.charAt(0);
  const familyName = person.familyName.charAt(0);
  return `${givenName}${familyName}`;
};

const getPersonName = (person) => {
  if (!person) {
    return i18n.t('actor:unknown');
  }

  if (person.name) {
    return person.name;
  }
  return `${person.givenName} ${person.familyName}`.trim();
};

const getAddress = (node) => {
  const fields = [];

  if (node.address) {
    fields.push(node.address);
  }

  if (node.city) {
    fields.push(node.city);
  }

  if (node.stateProvince) {
    fields.push(node.stateProvince);
  }

  if (node.country) {
    fields.push(countryList.getName(node.country));
  }

  return fields.join(', ');
};

const getAuthor = (node) => {
  return node.author || {
    id: null,
    name: i18n.t('actor:unknown'),
    givenName: '?',
    familyName: '?',
    type: TYPES.ACTOR.PERSON,
    imageURL: {},
  };
};

const getCommentURL = (comment) => {
  const { id, parentId, type } = comment;
  const service = type.split('.')[2];

  return `/${pluralize(service)}/${parentId}/#${id}`;
};

const getCoverURL = (node, size = 'medium') => {
  return node.coverUrls && node.coverUrls[size] && node.coverUrls[size].url;
};

const getOwnerName = (node) => {
  if (!node || !node.owner || !node.owner.name) {
    return '';
  }

  const { name } = node.owner;
  if (name.length > OWNER_NAME_CHAR_LIMIT) {
    return `${name.substring(0, OWNER_NAME_CHAR_LIMIT)}...`;
  }
  return name;
};

const getPortraitURL = (node, size = 'medium') => {
  const path = node.portraitUrls && node.portraitUrls[size] && node.portraitUrls[size].url;

  if (path) {
    return path.substring(0, 4) === 'http' ? path : new URL(path, process.env.REACT_APP_API_BASE_URL).href;
  }

  return '';
};

const getAvatarURL = (node, size = 'medium') => {
  const path = node.avatarUrls && node.avatarUrls[size] && node.avatarUrls[size].url;

  if (path) {
    return path.substring(0, 4) === 'http' ? path : new URL(path, process.env.REACT_APP_API_BASE_URL).href;
  }

  return '';
};

/*
* @TODO add support for array of objects
*/
const getStoryObjectName = (story) => {
  return story.object && story.object.name;
};

const getStorySubject = (story) => {
  return story.subject || {
    id: null,
    name: i18n.t('actor:unknown'),
    givenName: '?',
    familyName: '?',
    type: TYPES.ACTOR.PERSON,
    imageURL: {},
  };
};

const getURL = (node) => {
  if (node && node.id && node.type) {
    const service = pluralize(node.type.split('.')[3]);
    let slug = '';

    if (['people', 'hashtags'].includes(pluralize(service))) {
      slug = node.alias;
    } else if (node.alias) {
      slug = `${node.id}-${slugify(node.alias)}`;
    } else {
      slug = node.id;
    }

    return `/${pluralize(service)}/${slug}/`;
  }

  return '/';
};

const getServiceName = (node) => {
  return node.type.split('.')[2];
};

const getNamespace = (node) => {
  const entityName = node.type.split('.')[3];
  return pluralize(entityName);
};

const getSupportedMimetypes = (namespace) => {
  switch (namespace) {
    case 'documents':
      return [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
    case 'photos':
      return [
        'image/jpeg',
        'image/png',
      ];
    default:
      return [];
  }
};

const getComposers = (actor, viewer) => {
  if (!actor.features) {
    return [];
  }

  console.debug('actor', actor);

  const isOwnerOrAdmin = actor.id === viewer.id || isAdmin(viewer);

  return actor.features.reduce((composers, feature) => {
    if (!feature.enabled || !feature.composers.length) {
      return composers;
    }

    if (isOwnerOrAdmin) {
      return [...composers, ...feature.composers];
    }

    const { addPermissions = [] } = feature;

    if (addPermissions.length === 0) {
      return [...composers, ...feature.composers];
    }

    const hasAddPermission = addPermissions.some((permission) => {
      switch (permission.access) {
        case 'followers':
          return actor.isLeadingViewer;
        case 'admins':
          return actor.isAdminedByViewer;
        default:
          return false;
      }
    });

    if (hasAddPermission) {
      return [...composers, ...feature.composers];
    }

    return composers;
  }, []);
};

const getEnabledFeatures = (actor) => {
  const features = [];
  if (actor && actor.features) {
    return actor.features
      .filter((feature) => {
        return feature.enabled;
      })
      .map((feature) => {
        return feature.service.split('-')[0];
      });
  }

  return features;
};

const mergeNodes = (node, current, ignore) => {
  return Object.keys(node).reduce((acc, field) => {
    if (!ignore.includes(field)) {
      acc[field] = node[field];
    }
    return acc;
  }, { ...current });
};

export default {
  isActor,
  isPerson,
  isSuperAdmin,
  isAdmin,
  isRegistered,
  isMedium,
  isRepost,
  isComment,
  isCommentable,
  isLikeable,
  isSubscribable,
  isFollowable,
  isLeadable,
  getServiceName,
  getPersonInitials,
  getPersonName,
  getActorInitials,
  getAddress,
  getAuthor,
  getAvatarURL,
  getCommentURL,
  getCoverURL,
  getOwnerName,
  getPortraitURL,
  getStoryObjectName,
  getStorySubject,
  getSupportedMimetypes,
  getURL,
  getNamespace,
  getComposers,
  getEnabledFeatures,
  mergeNodes,
};
