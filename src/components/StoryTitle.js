import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

function getStorySubject(story) {
  return story.subject || {
    id: null,
    name: 'Unknown',
    givenName: '?',
    familyName: '?',
    objectType: 'com.people.person',
    imageURL: '',
  };
}

// @Todo add support for array objects
function getStoryObjectType(story) {
  return story.object && story.object.objectType.split('.')[2];
}

const StoryTitle = (props) => {
  const { story } = props;
  const subject = getStorySubject(story);

  switch (story.name) {
    case 'article_add':
    case 'note_add':
    case 'photo_add':
    case 'topic_add':
    case 'todo_add':
    case 'set_add': {
      const objectType = getStoryObjectType(story);
      const title = `${subject.name} added a ${objectType}`;
      return (
        <Typography variant="body2">
          {title}
        </Typography>
      );
    }
    case 'article_comment':
    case 'note_comment':
    case 'photo_comment':
    case 'topic_comment':
    case 'todo_comment':
    case 'set_comment': {
      const objectType = getStoryObjectType(story);
      const title = `${subject.name} commented on the ${objectType}`;
      return (
        <Typography variant="body2">
          {title}
        </Typography>
      );
    }
    case 'actor_add':
    case 'actor_follow':
    case 'actor_follower_add':
    default:
      return (
        <Typography variant="caption">
          {story.name}
        </Typography>
      );
  }
};

StoryTitle.propTypes = {
  story: PropTypes.object.isRequired,
};

export default StoryTitle;
