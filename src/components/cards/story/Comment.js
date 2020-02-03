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
import StoryCardOwner from '../Owner';
import Player from '../../Player';

import {
  getURL,
  getPortraitURL,
  getCoverURL,
} from '../../utils';

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
    cover: {
      height: theme.spacing(20),
      marginBottom: theme.spacing(2),
    },
    portrait: {
      height: theme.spacing(40),
      marginBottom: theme.spacing(2),
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    content: {
      marginLeft: theme.spacing(2),
      borderLeft: 1,
      borderLeftStyle: 'solid',
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
};

const StoryCardComment = (props) => {
  const {
    classes,
    story,
    actions,
    menu,
    comments,
    showOwner,
  } = props;

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object);
  const cover = story.object && getCoverURL(story.object);
  const title = story.object && story.object.name;
  const body = story.object && story.object.body;
  const url = story.object ? getURL(story.object) : '';

  return (
    <Card className={classes.card}>
      {showOwner &&
        <StoryCardOwner node={story} />
      }
      <CardHeader
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
            className={classes.cover}
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
      <CardContent className={classes.content}>
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

StoryCardComment.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comments: PropTypes.node.isRequired,
  story: PropTypes.object.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardComment.defaultProps = {
  showOwner: false,
  actions: null,
  menu: null,
};

export default withStyles(styles)(StoryCardComment);
