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
  const objectType = getStoryObjectType(story);
  let title = '';

  switch (story.name) {
    case 'article_add': {
      title = `${subject.name} published an ${objectType}`;
      break;
    }
    case 'note_add':
    case 'photo_add':
    case 'topic_add':
    case 'todo_add':
    case 'set_add': {
      title = `${subject.name} created a ${objectType}`;
      break;
    }
    case 'article_comment':
    case 'note_comment':
    case 'photo_comment':
    case 'topic_comment':
    case 'todo_comment':
    case 'set_comment': {
      title = `${subject.name} commented on the ${objectType}`;
      break;
    }
    case 'actor_add':
    case 'actor_follow':
    case 'actor_follower_add':
    default: {
      title = story.name;
    }
  }

  return (
    <Typography variant="body1">
      {title}
    </Typography>
  );
};

StoryTitle.propTypes = {
  story: PropTypes.object.isRequired,
};

export default StoryTitle;
