import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { getURL } from './utils';

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

const StoryMessage = (props) => {
  const { story } = props;
  const subject = getStorySubject(story);

  const objectType = getStoryObjectType(story);
  const subjectURL = getURL(subject);
  const objectURL = story.object ? getURL(story.object) : '';

  switch (story.name) {
    case 'article_add': {
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' published an '}
          <Link href={objectURL}>
            {objectType}
          </Link>
        </Typography>
      );
    }
    case 'topic_add': {
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' started a '}
          <Link href={objectURL}>
            {objectType}
          </Link>
        </Typography>
      );
    }
    case 'note_add':
    case 'photo_add': {
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' posted a '}
          <Link href={objectURL}>
            {objectType}
          </Link>
        </Typography>
      );
    }
    case 'actor_add':
    case 'todo_add':
    case 'set_add': {
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' created a '}
          <Link href={objectURL}>
            {objectType}
          </Link>
        </Typography>
      );
    }
    case 'article_comment':
    case 'note_comment':
    case 'photo_comment':
    case 'topic_comment':
    case 'todo_comment':
    case 'set_comment': {
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' commented on '}
          <Link href={objectURL}>
            {objectType}
          </Link>
        </Typography>
      );
    }
    case 'actor_follow': {
      const targetURL = story.target ? getURL(story.target) : '#';
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' is following '}
          <Link href={targetURL}>
            {story.target.name}
          </Link>
        </Typography>
      );
    }
    case 'actor_follower_add': {
      return (
        <Typography variant="body1">
          <Link href={subjectURL}>
            {subject.name}
          </Link>
          {' added '}
          <Link href={objectURL}>
            {story.object.name}
          </Link>
        </Typography>
      );
    }
    default:
      return (
        <Typography variant="body1">
          {story.name}
        </Typography>
      );
  }
};

StoryMessage.propTypes = {
  story: PropTypes.object.isRequired,
};

export default StoryMessage;
