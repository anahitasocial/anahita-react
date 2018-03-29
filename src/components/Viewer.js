import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router-dom';

const styles = {
  row: {
    display: 'flex',
  },
  avatar: {
    margin: 10,
  },
  name: {
    marginLeft: 10,
    marginTop: 10,
  },
  nameLink: {
    textDecoration: 'none',
  },
};

const Viewer = (props) => {
  const {
    classes,
    viewer,
  } = props;
  const profile = `/people/${viewer.username}/`;
  return (
    <div className={classes.row}>
      <Avatar
        alt={`${viewer.givenName.charAt(0)}${viewer.familyName.charAt(0)}`}
        src={viewer.imageURL.medium.url}
        className={classes.avatar}
        component={Link}
        to={profile}
      />
      <div className={classes.name}>
        <Typography variant="title" color="inherit">
          <Link replace to={profile} href={profile} className={classes.nameLink}>
            {viewer.givenName} {viewer.familyName}
          </Link>
        </Typography>
        <Typography variant="caption" color="inherit">
          @{viewer.alias}
        </Typography>
      </div>
    </div>
  );
};

Viewer.propTypes = {
  classes: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
};

export default withStyles(styles)(Viewer);
