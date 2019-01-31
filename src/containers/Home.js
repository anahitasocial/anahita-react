import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = ({
  flex: {},
});

const HomePage = (props) => {
  const { classes } = props;
  return (
    <React.Fragment>
      <Typography variant="h6" color="inherit" className={classes.flex}>
          Anahita
      </Typography>
      <Typography variant="body1" color="inherit" className={classes.flex}>
          Social networking platform and framework!
      </Typography>
    </React.Fragment>
  );
};

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
