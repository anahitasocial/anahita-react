import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Trans } from 'react-i18next';
import _ from 'lodash';
import { getURL } from './utils';
import i18n from '../languages';

function getStorySubject(story) {
  return story.subject || {
    id: null,
    name: i18n.t('actor:unknown'),
    givenName: '?',
    familyName: '?',
    objectType: 'com.people.person',
    imageURL: '',
  };
}

// @Todo add support for array objects
function getStoryObjectName(story) {
  return story.object && story.object.name;
}

const StoryMessage = (props) => {
  const { story } = props;

  const subject = getStorySubject(story);

  const subjectName = story.subject ? story.subject.name : i18n.t('actor:unknown');
  const subjectURL = getURL(subject);

  const objectName = getStoryObjectName(story) ? getStoryObjectName(story) : 'object';
  const objectURL = story.object ? getURL(story.object) : '';

  const targetName = story.target ? story.target.name : i18n.t('actor:unknown');
  const targetURL = story.target ? getURL(story.target) : '/';

  const i18nKey = _.camelCase(`${story.name}`);

  return (
    <Typography variant="body1">
      <Trans
        i18nKey={`stories.${i18nKey}`}
        values={{
          subject: subjectName,
          object: objectName,
          target: targetName,
        }}
      >
        <Link href={subjectURL}>
          {subjectName}
        </Link>
        <Link href={objectURL}>
          {objectName}
        </Link>
        <Link href={targetURL}>
          {targetName}
        </Link>
      </Trans>
    </Typography>
  );
};

StoryMessage.propTypes = {
  story: PropTypes.object.isRequired,
};

export default StoryMessage;
