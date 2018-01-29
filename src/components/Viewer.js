import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';

const styles = {
  row: {
    display: 'flex',
  },
  avatar: {
    margin: '10px',
  },
  name: {
    marginLeft: '10px',
    marginTop: '10px',
  },
};

const Viewer = (props) => {
  const {
    classes,
    viewer,
  } = props;

  return (
    <div className={classes.row}>
      <Avatar
        alt={viewer.name.charAt(0)}
        src={viewer.imageURL.medium.url}
        className={classes.avatar}
      />
      <div className={classes.name}>
        <Typography type="title" color="inherit">
          {viewer.name}
        </Typography>
        <Typography type="caption" color="inherit">
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
