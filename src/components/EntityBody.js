import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    fontSize: 13,
    fontFamily: 'inherit',
    color: theme.palette.text.primary,
  },
});

const EntityBody = (props) => {
  const { classes, body } = props;
  return (
    <Typography variatn="body1">
      <span
        className={classes.root}
        dangerouslySetInnerHTML={{
        __html: body,
        }}
      />
    </Typography>
  );
};

EntityBody.propTypes = {
  classes: PropTypes.object.isRequired,
  body: PropTypes.string,
};

EntityBody.defaultProps = {
  body: '',
};

export default withStyles(styles)(EntityBody);
