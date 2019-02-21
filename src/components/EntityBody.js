import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => {
  return {
    root: {
      fontFamily: theme.typography.fontFamily,
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01071em',
      lineHeight: 1.5,
      color: theme.palette.text.primary,
    },
  };
};

const EntityBody = (props) => {
  const {
    classes,
    children,
  } = props;

  return (
    <span
      className={classes.root}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
};

EntityBody.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.string.isRequired,
};

export default withStyles(styles)(EntityBody);
