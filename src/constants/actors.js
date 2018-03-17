import async from './async';

const actors = async('actors');
export default {
  RESET: 'ACTORS_RESET',
  BROWSE: actors('browse'),
  FOLLOW: actors('follow'),
  UNFOLLOW: actors('unfollow'),
};
