import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Typography from 'material-ui/Typography';

const styles = ({
  root: {},
});

const HomePage = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography type="title" color="inherit" className={classes.flex}>
          Anahita
      </Typography>
      <Typography type="body1" color="inherit" className={classes.flex}>
          Social networking platform and framework!
      </Typography>
    </div>
  );
};

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
