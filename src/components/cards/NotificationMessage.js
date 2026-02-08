import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Trans } from 'react-i18next';
import _ from 'lodash';
import utils from '../../utils';
import i18n from '../../languages';

const {
  getURL,
  getStorySubject,
  getStoryObjectName,
} = utils.node;

const NotificationMessage = (props) => {
  const { notification } = props;

  const subject = notification.subjects ?
    notification.subjects[notification.subjects.length - 1] :
    getStorySubject(notification);

  const subjectName = subject.id ? subject.name : i18n.t('actor:unknown');
  const subjectURL = getURL(subject);
  const objectName = getStoryObjectName(notification) ? getStoryObjectName(notification) : 'object';
  const objectURL = notification.object ? getURL(notification.object) : '';

  const { target } = notification;
  const targetName = target.id ? target.name : i18n.t('actor:unknown');
  const targetURL = target.id ? getURL(target) : '/';
  const i18nKey = _.camelCase(notification.type);

  return (
    <Typography variant="body1">
      <Trans
        i18nKey={`notifications:${i18nKey}`}
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

NotificationMessage.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationMessage;
