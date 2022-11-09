import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PersonType from '../../proptypes/Person';
import utils from '../../utils';
import i18n from '../../languages';

const {
  getActorInitials,
  getPortraitURL,
} = utils.node;

const styles = (theme) => {
  return {
    content: {
      flex: '0 0 auto',
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    avatarContent: {
      flex: '1 1 auto',
    },
    avatar: {
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
  };
};

const Viewer = (props) => {
  const {
    classes,
    viewer,
    isAuthenticated,
  } = props;

  const profile = `/people/${viewer.username}/`;
  const initials = getActorInitials(viewer);
  const avatar = getPortraitURL(viewer);
  const {
    givenName,
    familyName,
    alias,
  } = viewer;

  return (
    <>
      {!isAuthenticated &&
      <Button
        href="/auth"
        color="inherit"
        variant="outlined"
      >
        {i18n.t('actions:login')}
      </Button>}
      {isAuthenticated &&
        <Button
          href={profile}
          color="inherit"
        >
          <div className={classes.content}>
            <Typography
              variant="h4"
              color="inherit"
              className={classes.name}
              align="right"
            >
              {`${givenName} ${familyName}`}
            </Typography>
            <Typography
              className={classes.alias}
              variant="subtitle1"
              color="inherit"
              align="right"
            >
              {alias}
            </Typography>
          </div>
          <div className={classes.avatarContent}>
            <Avatar
              alt={initials}
              src={avatar}
              className={classes.avatar}
            />
          </div>
        </Button>}
    </>
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
