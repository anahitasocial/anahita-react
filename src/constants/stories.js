import async from './async';
import comments from './comments';

const stories = async('stories');
const story = async('story');
const storyComments = comments('stories');

export default {
  BROWSE: {
    ...stories('browse'),
    RESET: 'STORIES_BROWSE_RESET',
  },
  READ: story('read'),
  DELETE: story('delete'),
  COMMENTS: {
    ...storyComments,
  },
};
