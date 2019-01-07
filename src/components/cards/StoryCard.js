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
import { pluralize } from 'inflection';

import ActorTitle from '../ActorTitle';
import ActorAvatar from '../ActorAvatar';
import EntityBody from '../EntityBody';

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
    action,
  } = props;

  const subject = story.subject || {
    id: null,
    name: 'unknown',
    givenName: '?',
    familyName: '?',
    objectType: 'com.people.person',
    imageURL: {},
  };

  const portrait = story.object &&
  story.object.imageURL &&
  story.object.imageURL.medium &&
  story.object.imageURL.medium.url;

  const cover = story.object &&
  story.object.coverURL &&
  story.object.coverURL.medium &&
  story.object.coverURL.medium.url;

  const title = story.object && story.object.name;
  let path = '';
  const body = story.object && story.object.body;

  if (title) {
    const namespace = pluralize(story.object.objectType.split('.')[2]);
    const objectId = story.object.id;
    path = `/${namespace}/${objectId}/`;
  }

  return (
    <Card square>
      <CardHeader
        avatar={
          <ActorAvatar
            actor={subject}
            linked={Boolean(subject.id)}
          />
        }
        title={
          <ActorTitle
            actor={subject}
            typographyProps={{
                component: 'h4',
                variant: 'title',
                className: classes.authorName,
            }}
            linked={Boolean(subject.id)}
          />
        }
        subheader={
          <ActorTitle
            actor={story.owner}
            typographyProps={{
                component: 'h5',
                variant: 'subheading',
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
        />
      }
      {portrait &&
        <CardMedia
          className={classes.portrait}
          title={title}
          image={portrait}
        />
      }
      <CardContent>
        {title &&
          <ButtonBase
            component={Link}
            to={path}
            href={path}
          >
            <Typography
              variant="title"
              component="h2"
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
        {action}
      </CardActions>
    </Card>
  );
};

StoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.node,
  story: PropTypes.object.isRequired,
};

StoryCard.defaultProps = {
  action: null,
};

export default withStyles(styles)(StoryCard);
