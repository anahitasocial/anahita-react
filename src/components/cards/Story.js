import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Truncate from 'react-truncate';
import striptags from 'striptags';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import StoryMessage from '../StoryMessage';
import ActorTitle from '../ActorTitle';
import ActorAvatar from '../ActorAvatar';

import {
  getURL,
  getPortraitURL,
  getCoverURL,
  getStorySubject,
} from '../utils';

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing.unit * 2,
    },
    media: {
      height: theme.spacing.unit * 20,
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing.unit * 2,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
    portrait: {
      minHeight: theme.spacing.unit * 30,
    },
  };
};

const TRUNCATE_WIDTH = 640;
const TRUNCATE_LINES = 3;

const StoryCard = (props) => {
  const {
    classes,
    story,
    actions,
  } = props;

  const subject = getStorySubject(story);

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object);
  const cover = story.object && getCoverURL(story.object);
  const title = story.object && story.object.name;
  const body = story.object && striptags(story.object.body);
  const url = title && story.object ? getURL(story.object) : '';

  return (
    <Card square className={classes.card}>
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
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        subheader={
          <ActorTitle
            actor={story.owner}
            typographyProps={{
                variant: 'subtitle1',
                className: classes.ownerName,
            }}
            linked
          />
        }
      />
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.media}
            image={cover}
            title={title}
          />
        </Link>
      }
      {portrait &&
        <Link href={url}>
          <CardMedia
            className={classes.portrait}
            title={title}
            image={portrait}
          />
        </Link>
      }
      <CardContent>
        {title &&
          <Typography
            variant="h6"
            className={classes.title}
          >
            <Link href={url}>
              {title}
            </Link>
          </Typography>
        }
        {body &&
          <Typography variant="body2">
            <Truncate
              trimWhitespace
              width={TRUNCATE_WIDTH}
              lines={TRUNCATE_LINES}
              ellipsis={
                <span>... <Link href={url}>Read more</Link></span>}
            >
              {body}
            </Truncate>
          </Typography>
        }
      </CardContent>
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
    </Card>
  );
};

StoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.arrayOf(PropTypes.node),
  story: PropTypes.object.isRequired,
};

StoryCard.defaultProps = {
  actions: [],
};

export default withStyles(styles)(StoryCard);
