import async from './async';

const media = async('media');
const medium = async('medium');
const portrait = async('portrait');

export default {
  RESET: 'MEDIA_RESET',
  BROWSE: media('browse'),
  READ: medium('read'),
  EDIT: medium('edit'),
  ADD: medium('add'),
  DELETE: medium('delete'),
  PORTRAIT: {
    ADD: portrait('add'),
    DELETE: portrait('delete'),
  },
};
