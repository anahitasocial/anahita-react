import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => {
  return {
    root: {
      fontFamily: theme.typography.fontFamily,
      fontWeight: 400,
      letterSpacing: 0.1,
      lineHeight: 1.5,
      color: theme.palette.text.primary,
    },
    largeSize: {
      fontSize: 16,
    },
    smallSize: {
      fontSize: 13,
    },
    defaultSize: {
      fontSize: 14,
    },
  };
};

const EntityBody = (props) => {
  const {
    classes,
    children,
    size,
  } = props;

  return (
    <span
      className={classNames(
        classes.root,
        classes[`${size}Size`],
      )}
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  );
};

EntityBody.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'large', 'default']),
};

EntityBody.defaultProps = {
  size: 'default',
};

export default withStyles(styles)(EntityBody);
