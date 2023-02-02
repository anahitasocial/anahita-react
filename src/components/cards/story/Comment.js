import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import ReadMore from '../../ReadMore';
import StoryMessage from './StoryMessage';
import StoryCardOwner from '../Owner';
import Player from '../../Player';
import utils from '../../../utils';

const {
  getURL,
  getPortraitURL,
  getCoverURL,
} = utils.node;

const useStyles = makeStyles((theme) => {
  return {
    card: {
      marginBottom: theme.spacing(2),
    },
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    title: {
      textTransform: 'capitalize',
      marginBottom: theme.spacing(2),
    },
    content: {
      marginLeft: theme.spacing(2),
      borderLeft: 4,
      borderColor: theme.palette.background.default,
      borderLeftStyle: 'solid',
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 14,
    },
  };
});

const StoryCardComment = (props) => {
  const {
    story,
    actions,
    stats,
    menu,
    comments,
    showOwner,
  } = props;
  const classes = useStyles();

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object, 'large');
  const cover = story.object && getCoverURL(story.object);
  const title = story.object && story.object.name;
  const body = story.object && story.object.body;
  const url = story.object ? getURL(story.object) : '';
  const creationTime = moment.utc(story.creationTime).local().format('LLL').toString();
  const creationTimeFromNow = moment.utc(story.creationTime).fromNow();

  return (
    <Card
      className={classes.card}
      component="article"
    >
      {showOwner && <StoryCardOwner node={story} />}
      <CardHeader
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
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={title}
          />
        </Link>}
      {portrait &&
        <Link href={url}>
          <CardMedia
            component="img"
            title={title}
            image={portrait}
          />
        </Link>}
      {body && <Player text={body} />}
      <CardContent className={classes.content}>
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

StoryCardComment.propTypes = {
  stats: PropTypes.node,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comments: PropTypes.node.isRequired,
  story: PropTypes.object.isRequired,
  showOwner: PropTypes.bool,
};

StoryCardComment.defaultProps = {
  showOwner: false,
  stats: null,
  actions: null,
  menu: null,
};

export default StoryCardComment;
