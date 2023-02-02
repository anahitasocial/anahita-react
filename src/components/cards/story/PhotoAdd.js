import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import ReadMore from '../../ReadMore';
import StoryMessage from './StoryMessage';
import ActorAvatar from '../../actor/Avatar';
import GridList from './GridList';
import StoryCardOwner from '../Owner';
import utils from '../../../utils';

const {
  getURL,
  getPortraitURL,
  getStorySubject,
} = utils.node;

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
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

const StoryCardPhotoAdd = (props) => {
  const {
    classes,
    story,
    stats,
    actions,
    menu,
    showOwner,
    comments,
  } = props;

  const subject = getStorySubject(story);

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object, 'large');
  const portraits = story.objects;

  const title = story.object && story.object.name;
  const body = story.object && story.object.body;
  const url = story.object ? getURL(story.object) : '';
  const showOwnerHeader = showOwner && (story.subject.id !== story.owner.id);
  const creationTime = moment.utc(story.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(story.creationTime).fromNow();

  const [isLoaded, setIsLoaded] = useState(!portrait);

  useEffect(() => {
    if (portrait) {
      // eslint-disable-next-line no-undef
      const image = new Image();

      image.src = portrait;

      image.onload = () => {
        setIsLoaded(true);
      };
    }
  }, [portrait]);

  return (
    <Card
      className={classes.card}
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
      {portraits && <GridList photos={portraits} />}
      {!portraits && portrait && isLoaded &&
        <Link href={url}>
          <CardMedia
            component="img"
            title={title}
            image={portrait}
          />
        </Link>}
      <CardContent>
        {title &&
          <Typography
            variant="h6"
            className={classes.title}
          >
            <Link href={url}>
              {title}
            </Link>
          </Typography>}
        {body &&
          <ReadMore contentFilter>
            {body}
          </ReadMore>}
      </CardContent>
      {stats &&
        <CardActions>
          {stats}
        </CardActions>}
      {actions &&
        <CardActions>
          {actions}
        </CardActions>}
      {comments}
    </Card>
  );
};

StoryCardPhotoAdd.propTypes = {
  classes: PropTypes.object.isRequired,
  stats: PropTypes.node,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comments: PropTypes.node,
  story: PropTypes.object.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardPhotoAdd.defaultProps = {
  showOwner: false,
  actions: null,
  stats: null,
  menu: null,
  comments: null,
};

export default withStyles(styles)(StoryCardPhotoAdd);
