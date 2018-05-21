import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import GroupsIcon from '@material-ui/icons/GroupWork';
import NotesIcon from '@material-ui/icons/Note';
import PhotosIcon from '@material-ui/icons/Photo';
import TopicsIcon from '@material-ui/icons/QuestionAnswer';
import LockOpenIcon from '@material-ui/icons/LockOpen';
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
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/people/"
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="People" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/groups/"
        >
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/notes/"
        >
          <ListItemIcon>
            <NotesIcon />
          </ListItemIcon>
          <ListItemText primary="Notes" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/photos/"
        >
          <ListItemIcon>
            <PhotosIcon />
          </ListItemIcon>
          <ListItemText primary="Photos" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/topics/"
        >
          <ListItemIcon>
            <TopicsIcon />
          </ListItemIcon>
          <ListItemText primary="Topics" />
        </ListItem>
        {isAuthenticated &&
          <ListItem
            button
            component="a"
            onClick={onLogoutClick}
          >
            <ListItemIcon>
              <LockOpenIcon />
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
