import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Link from '@material-ui/core/Link';

import StoryMessage from './StoryMessage';
import ActorAvatar from '../../actor/Avatar';
import StoryType from '../../../proptypes/Story';
import StoryCardOwner from '../Owner';
import utils from '../../../utils';

const {
  getURL,
  getStorySubject,
} = utils.node;

const styles = (theme) => {
  return {
    root: {
      marginBottom: theme.spacing(2),
    },
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    media: {
      height: 0,
      paddingTop: '100%',
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
};

const StoryCardActor = (props) => {
  const {
    classes,
    story,
    menu,
    showOwner,
  } = props;

  const subject = getStorySubject(story);

  // @Todo add support for array objects
  const url = story.object ? getURL(story.object) : '';
  const showOwnerHeader = showOwner && (story.subject.id !== story.owner.id);
  const creationTime = moment.utc(story.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(story.creationTime).fromNow();

  return (
    <Card
      className={classes.root}
      component="section"
    >
      {showOwnerHeader && <StoryCardOwner node={story} />}
      <CardHeader
        avatar={
          <ActorAvatar
            actor={subject}
            linked={Boolean(subject.id)}
          />
        }
        title={
          <StoryMessage story={story} />
        }
        subheader={
          <Link
            href={url}
            title={creationTime}
          >
            {creationTimeFromNow}
          </Link>
        }
        action={menu}
      />
    </Card>
  );
};

StoryCardActor.propTypes = {
  classes: PropTypes.object.isRequired,
  menu: PropTypes.node,
  story: StoryType.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardActor.defaultProps = {
  showOwner: false,
  menu: null,
};

export default withStyles(styles)(StoryCardActor);
