import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    fontFamily: 'inherit',
    color: theme.palette.text.primary,
  },
});

const EntityBody = (props) => {
  const { classes, body, noWrap } = props;
  return (
    <Typography variatn="body2" noWrap={noWrap}>
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
  noWrap: PropTypes.bool,
};

EntityBody.defaultProps = {
  body: '',
  noWrap: false,
};

export default withStyles(styles)(EntityBody);
