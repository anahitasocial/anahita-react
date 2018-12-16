import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom/Link';

import PersonType from '../proptypes/Person';

const styles = theme => ({
  root: {
    marginRight: 20,
  },
  viewer: {},
  content: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
  },
  avatarContent: {
    flex: '1 1 auto',
  },
  avatar: {
    textDecoration: 'none',
    fontSize: 16,
  },
  name: {
    textTransform: 'capitalize',
    fontSize: 16,
  },
  alias: {
    textTransform: 'lowercase',
    fontSize: 14,
  },
});

const Viewer = (props) => {
  const {
    classes,
    viewer,
    isAuthenticated,
  } = props;

  const profile = `/people/${viewer.username}/`;
  return (
    <div className={classes.root}>
      {!isAuthenticated &&
      <Button
        component={Link}
        to="/login/"
        color="inherit"
      >
        {'Login'}
      </Button>
      }
      {isAuthenticated &&
      <div className={classes.viewer}>
        <Button
          component={Link}
          to={profile}
          color="inherit"
        >
          <div className={classes.content}>
            <Typography
              variant="title"
              color="inherit"
              className={classes.name}
              align="right"
            >
              {viewer.givenName} {viewer.familyName}
            </Typography>
            <Typography
              className={classes.alias}
              variant="subheading"
              color="inherit"
              align="right"
            >
              @{viewer.alias}
            </Typography>
          </div>
          <div className={classes.avatarContent}>
            <Avatar
              alt={`${viewer.givenName.charAt(0)}${viewer.familyName.charAt(0)}`}
              src={viewer.imageURL.medium.url}
              className={classes.avatar}
            />
          </div>
        </Button>
      </div>
      }
    </div>
  );
};

Viewer.propTypes = {
  classes: PropTypes.object.isRequired,
  viewer: PersonType,
  isAuthenticated: PropTypes.bool,
};

Viewer.defaultProps = {
  viewer: {},
  isAuthenticated: false,
};

export default withStyles(styles)(Viewer);
