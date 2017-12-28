import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import withStyles from 'material-ui/styles/withStyles';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';

const styles = {
  row: {
    display: 'flex',
  },
  avatar: {
    margin: 10,
  },
  name: {
      marginLeft: 10,
      marginTop: 10
  }
};

const Viewer = (props) => {

    const { classes, viewer } = props;

    return (
       <div className={classes.row}>
           <Avatar
            alt={viewer.name.charAt(0)}
            src={viewer.imageURL.medium.url}
            className={classNames(classes.avatar)}
          />
          <div className={classes.name}>
          <Typography type="title" color="inherit">
              {viewer.name}
          </Typography>
          <Typography type="subheading" color="inherit">
              @{viewer.alias}
          </Typography>
          </div>
       </div>
   );
};

Viewer.propTypes = {
    classes: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired
}

export default withStyles(styles)(Viewer);
