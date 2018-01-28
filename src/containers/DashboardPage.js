import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';

const styles = ({
  root: {},
});

const DashboardPage = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography type="title" color="inherit" className={classes.flex}>
          Dashboard
      </Typography>
      <Typography type="body1" color="inherit" className={classes.flex}>
          You are now logged in!
      </Typography>
    </div>
  );
};

DashboardPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardPage);
