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

import EntityBody from '../EntityBody';

const styles = theme => ({
  root: {},
  alias: {
    fontSize: 14,
  },
  media: {
    height: theme.spacing.unit * 20,
  },
});

const ActorCard = (props) => {
  const {
    classes,
    name,
    alias,
    description,
    cardAvatar,
    cardTitle,
    cover,
    profile,
    action,
  } = props;

  return (
    <React.Fragment>
      <Card className={classes.root} square>
        {cover &&
          <Link to={profile} href={profile}>
            <CardMedia
              className={classes.media}
              image={cover}
              title={name}
            />
          </Link>
        }
        <CardHeader
          avatar={cardAvatar}
          title={cardTitle}
          subheader={
            <Typography
              variant="subheading"
              className={classes.alias}
            >
              {`@${alias}`}
            </Typography>
          }
        />
        {description &&
        <CardContent>
          <EntityBody body={description} />
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
  name: PropTypes.string.isRequired,
  alias: PropTypes.string.isRequired,
  description: PropTypes.string,
  cardAvatar: PropTypes.node.isRequired,
  cardTitle: PropTypes.node.isRequired,
  cover: PropTypes.string,
  profile: PropTypes.string.isRequired,
  action: PropTypes.node,
};

ActorCard.defaultProps = {
  description: '',
  cover: '',
  action: null,
};

export default withStyles(styles)(ActorCard);
