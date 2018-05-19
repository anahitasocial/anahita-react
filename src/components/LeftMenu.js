import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Home from '@material-ui/icons/Home';
import People from '@material-ui/icons/People';
import GroupWork from '@material-ui/icons/GroupWork';
import Photo from '@material-ui/icons/Photo';
import LockOpen from '@material-ui/icons/LockOpen';
import { Link } from 'react-router-dom';

const styles = ({
  root: {},
});

const LeftMenu = (props) => {
  const {
    classes,
    isAuthenticated,
    onLogoutClick,
  } = props;

  return (
    <div className={classes.root}>
      <List>
        <ListItem
          button
          component={Link}
          to="/"
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/people/"
        >
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="People" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/groups/"
        >
          <ListItemIcon>
            <GroupWork />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/photos/"
        >
          <ListItemIcon>
            <Photo />
          </ListItemIcon>
          <ListItemText primary="Photos" />
        </ListItem>
        {isAuthenticated &&
          <ListItem
            button
            component="a"
            onClick={onLogoutClick}
          >
            <ListItemIcon>
              <LockOpen />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        }
      </List>
    </div>
  );
};

LeftMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

LeftMenu.defaultProps = {
  isAuthenticated: false,
};

export default withStyles(styles)(LeftMenu);
