import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import contentfilter from '../../contentfilter';
import ReadMore from '../../ReadMore';
import StoryMessage from '../../StoryMessage';
import ActorAvatar from '../../actor/Avatar';
import GridList from './GridList';
import StoryCardOwner from '../Owner';

import {
  getURL,
  getPortraitURL,
  getStorySubject,
} from '../../utils';

const styles = (theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
    portrait: {
      height: theme.spacing(40),
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
    actions,
    menu,
    showOwner,
  } = props;

  const subject = getStorySubject(story);

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object);
  const portraits = story.objects;

  const title = story.object && story.object.name;
  const body = story.object && story.object.body;
  const url = story.object ? getURL(story.object) : '';
  const showOwnerHeader = showOwner && (story.subject.id !== story.owner.id);

  return (
    <Card square className={classes.card}>
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
      {portraits &&
        <GridList photos={portraits} />
      }
      {!portraits && portrait &&
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
    </Card>
  );
};

StoryCardPhotoAdd.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  story: PropTypes.object.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardPhotoAdd.defaultProps = {
  showOwner: false,
  actions: null,
  menu: null,
};

export default withStyles(styles)(StoryCardPhotoAdd);
