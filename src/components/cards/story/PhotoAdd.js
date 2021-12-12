import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
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

  return (
    <Card
      className={classes.card}
      variant="outlined"
      component="section"
    >
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
            {moment(story.creationType).fromNow()}
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
            component="img"
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
          <ReadMore contentFilter>
            {body}
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

StoryCardPhotoAdd.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comments: PropTypes.node,
  story: PropTypes.object.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardPhotoAdd.defaultProps = {
  showOwner: false,
  actions: null,
  menu: null,
  comments: null,
};

export default withStyles(styles)(StoryCardPhotoAdd);
