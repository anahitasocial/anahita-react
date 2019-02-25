import async from './async';

const media = async('media');
const portrait = async('portrait');

export default {
  BROWSE: {
    ...media('browse'),
    RESET: 'MEDIA_BROWSE_RESET',
  },
  READ: media('read'),
  EDIT: media('edit'),
  ADD: media('add'),
  DELETE: media('delete'),
  PORTRAIT: {
    ADD: portrait('add'),
    DELETE: portrait('delete'),
  },
};
