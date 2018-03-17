import async from './async';

const people = async('people');
export default {
  RESET: 'PEOPLE_RESET',
  BROWSE: people('browse'),
  FOLLOW: people('follow'),
  UNFOLLOW: people('unfollow'),
};
