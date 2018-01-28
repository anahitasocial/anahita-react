import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from 'material-ui/List';
import Home from 'material-ui-icons/Home';
import People from 'material-ui-icons/People';
import GroupWork from 'material-ui-icons/GroupWork';
import Photo from 'material-ui-icons/Photo';
import LockOpen from 'material-ui-icons/LockOpen';
import { Link } from 'react-router-dom';

const styles = ({});

const LeftMenu = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <ListItem
        button
        component={Link}
        to="/"
      >
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
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
        to="/photos/"
      >
        <ListItemIcon>
          <Photo />
        </ListItemIcon>
        <ListItemText primary="Photos" />
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
        component="a"
        onClick={props.onLogoutClick}
      >
        <ListItemIcon>
          <LockOpen />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </div>
  );
};

LeftMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(LeftMenu);
