import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import StoryTitle from '../StoryTitle';
import ActorTitle from '../ActorTitle';
import ActorAvatar from '../ActorAvatar';
import EntityBody from '../EntityBody';
import {
  getURL,
  getPortraitURL,
  getCoverURL,
} from '../utils';

const styles = (theme) => {
  return {
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

const StoryCard = (props) => {
  const {
    classes,
    story,
    actions,
  } = props;

  const subject = story.subject || {
    id: null,
    name: 'unknown',
    givenName: '?',
    familyName: '?',
    objectType: 'com.people.person',
    imageURL: {},
  };

  // @Todo add support for array objects
  const portrait = story.object && getPortraitURL(story.object);
  const cover = story.object && getCoverURL(story.object);
  const title = story.object && story.object.name;
  const body = story.object && story.object.body;
  const url = title ? getURL(story.object) : '';

  return (
    <Card>
      <CardHeader
        avatar={
          <ActorAvatar
            actor={subject}
            linked={Boolean(subject.id)}
          />
        }
        title={
          <StoryTitle story={story} />
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
        <CardMedia
          className={classes.media}
          image={cover}
          title={title}
          component={Link}
          to={url}
          href={url}
        />
      }
      {portrait &&
        <CardMedia
          className={classes.portrait}
          title={title}
          image={portrait}
          component={Link}
          to={url}
          href={url}
        />
      }
      <CardContent>
        {title &&
          <ButtonBase
            component={Link}
            to={url}
            href={url}
          >
            <Typography
              variant="h6"
              className={classes.title}
            >
              {title}
            </Typography>
          </ButtonBase>
        }
        {body &&
          <EntityBody body={body} />
        }
      </CardContent>
      <CardActions>
        {actions}
      </CardActions>
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
