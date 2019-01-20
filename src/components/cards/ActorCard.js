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

import ActorType from '../../proptypes/Actor';
import ActorTitle from '../ActorTitle';
import ActorAvatar from '../ActorAvatar';
import EntityBody from '../EntityBody';

import {
  getURL,
  getCoverURL,
} from '../utils';

const styles = (theme) => {
  return {
    title: {
      fontSize: 16,
    },
    alias: {
      fontSize: 12,
    },
    media: {
      height: theme.spacing.unit * 20,
    },
  };
};

const ActorCard = (props) => {
  const {
    classes,
    actor,
    action,
  } = props;

  const cover = getCoverURL(actor);
  const url = getURL(actor);

  return (
    <React.Fragment>
      <Card square>
        {cover &&
          <Link to={url} href={url}>
            <CardMedia
              className={classes.media}
              image={cover}
              title={actor.name}
            />
          </Link>
        }
        <CardHeader
          avatar={
            <ActorAvatar
              actor={actor}
              linked
            />
          }
          title={
            <ActorTitle
              actor={actor}
              typographyProps={{
                  component: 'h4',
                  variant: 'title',
                  className: classes.title,
              }}
              linked
            />
          }
          subheader={
            <Typography
              variant="subheading"
              className={classes.alias}
            >
              {`@${actor.alias}`}
            </Typography>
          }
        />
        {actor.body &&
        <CardContent>
          <EntityBody body={actor.body} />
        </CardContent>
        }
        <CardActions>
          {action}
        </CardActions>
      </Card>
    </React.Fragment>
  );
};

ActorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.node,
  actor: PropTypes.objectOf(ActorType).isRequired,
};

ActorCard.defaultProps = {
  action: null,
};

export default withStyles(styles)(ActorCard);
