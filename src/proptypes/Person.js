import {
  shape,
  number,
  string,
  oneOf,
  arrayOf,
} from 'prop-types';

import PERSON from '../constants/person';
import ImageUrls from './ImageUrls';

const { USERTYPE } = PERSON.FIELDS;

export default shape({
  id: number,
  type: oneOf(['node.actor.person-service.person.v1']),
  name: string,
  alias: string,
  // `username` is gone: it WAS the alias, sent twice under two names. email
  // and password are gone from the person shape too — they are credentials,
  // and the API no longer returns either on a profile.
  person_type: oneOf([
    USERTYPE.GUEST,
    USERTYPE.REGISTERED,
    USERTYPE.ADMIN,
    USERTYPE.SUPER_ADMIN,
  ]),
  // Free text. The gender enum it replaces hard-coded English grammar and was
  // meaningless in a language with no gendered third-person pronoun.
  person_pronouns: string,
  body: string,
  gadgets: arrayOf(string),
  composers: arrayOf(string),
  avatarURLs: ImageUrls,
  coverURLs: ImageUrls,
  followerCount: number,
  leaderCount: number,
  mutualCount: number,
  subscriberCount: number,
  creationTime: string,
  updateTime: string,
  websiteUrl: string,
});
