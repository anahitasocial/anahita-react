import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import contentfilter from '../../contentfilter';
import ReadMore from '../../ReadMore';
import StoryMessage from '../../StoryMessage';
import ActorAvatar from '../../actor/Avatar';
import StoryType from '../../../proptypes/Story';
import StoryCardOwner from '../Owner';
import Player from '../../Player';

import {
  getURL,
  getPortraitURL,
  getCoverURL,
  getStorySubject,
} from '../../utils';

const styles = (theme) => {
  return {
    root: {
      marginBottom: theme.spacing(2),
    },
    media: {
      height: theme.spacing(30),
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
    portrait: {
      minHeight: theme.spacing(30),
    },
  };
};

const StoryCardDefault = (props) => {
  const {
    classes,
    story,
    actions,
    menu,
    comments,
    showOwner,
  } = props;

  const subject = getStorySubject(story);

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object);
  const cover = story.object && getCoverURL(story.object);
  const title = story.object && story.object.name;
  const body = story.object && story.object.body;
  const url = story.object ? getURL(story.object) : '';
  const showOwnerHeader = showOwner && (story.subject.id !== story.owner.id);

  return (
    <Card className={classes.root}>
      {showOwnerHeader &&
        <StoryCardOwner node={story} />
      }
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
          <Link href={url}>
            <ReactTimeAgo
              date={new Date(story.creationTime)}
            />
          </Link>
        }
        action={menu}
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
      {body &&
        <Player text={body} />
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
          <ReadMore>
            {contentfilter({
              text: body,
              filters: [
                'hashtag',
                'mention',
                'url',
              ],
            })}
          </ReadMore>
        }
      </CardContent>
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
      <Divider />
      {comments}
    </Card>
  );
};

StoryCardDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comments: PropTypes.node,
  story: StoryType.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardDefault.defaultProps = {
  showOwner: false,
  actions: null,
  menu: null,
  comments: null,
};

export default withStyles(styles)(StoryCardDefault);
