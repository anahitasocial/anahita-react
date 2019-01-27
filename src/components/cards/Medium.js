import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import MediumType from '../../proptypes/Medium';
import ActorTitle from '../ActorTitle';
import ActorAvatar from '../ActorAvatar';
import EntityBody from '../EntityBody';

import {
  getAuthor,
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
      fontSize: 16,
      fontWeight: 500,
      marginBottom: theme.spacing.unit * 2,
    },
    titleLink: {
      textDecoration: 'none',
      color: theme.palette.text.primary,
    },
    portrait: {
      minHeight: theme.spacing.unit * 30,
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};

const MediumCard = (props) => {
  const {
    classes,
    medium,
    action,
  } = props;

  const portrait = getPortraitURL(medium);
  const cover = getCoverURL(medium);
  const url = getURL(medium);
  const author = getAuthor(medium);

  return (
    <React.Fragment>
      <Card square>
        {cover &&
          <CardMedia
            className={classes.media}
            image={cover}
            title={medium.name}
            component={Link}
            to={url}
            href={url}
          />
        }
        <CardHeader
          avatar={
            <ActorAvatar
              actor={author}
              linked={Boolean(author.id)}
            />
          }
          title={
            <ActorTitle
              actor={author}
              typographyProps={{
                  component: 'h4',
                  variant: 'title',
                  className: classes.authorName,
              }}
              linked={Boolean(author.id)}
            />
          }
          subheader={
            <ActorTitle
              actor={medium.owner}
              typographyProps={{
                  component: 'h5',
                  variant: 'subheading',
                  className: classes.ownerName,
              }}
              linked
            />
          }
        />
        {portrait &&
          <CardMedia
            className={classes.portrait}
            title={medium.name}
            image={portrait}
            component={Link}
            to={url}
            href={url}
          />
        }
        <CardContent>
          {medium.name &&
            <Typography
              variant="title"
              component="h2"
              className={classes.title}
            >
              <Link
                to={url}
                href={url}
                className={classes.titleLink}
              >
                {medium.name}
              </Link>
            </Typography>
          }
          {medium.body &&
            <EntityBody body={medium.body} />
          }
        </CardContent>
        <CardActions>
          {action}
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.node,
  medium: MediumType.isRequired,
};

MediumCard.defaultProps = {
  action: null,
};

export default withStyles(styles)(MediumCard);
