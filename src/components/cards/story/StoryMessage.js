import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Trans } from 'react-i18next';
import _ from 'lodash';
import utils from '../../../utils';
import i18n from '../../../languages';

const {
  getURL,
  getStorySubject,
  getStoryObjectName,
} = utils.node;

const StoryMessage = (props) => {
  const { story } = props;

  const subject = story.subjects ?
    story.subjects[story.subjects.length - 1] :
    getStorySubject(story);

  const subjectName = subject.id ? subject.name : i18n.t('actor:unknown');
  const subjectURL = getURL(subject);
  const objectName = getStoryObjectName(story) ? getStoryObjectName(story) : 'object';
  const objectURL = story.object ? getURL(story.object) : '';

  const target = story.targets ?
    story.targets[story.targets.length - 1] :
    story.target;
  const targetName = target.id ? target.name : i18n.t('actor:unknown');
  const targetURL = target.id ? getURL(target) : '/';

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
