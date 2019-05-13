import React from 'react';
import PropTypes from 'prop-types';
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
import ArticlesIcon from '@material-ui/icons/LibraryBooks';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Link } from 'react-router-dom';

import i18n from '../languages';

const LeftMenu = (props) => {
  const {
    isAuthenticated,
    onLogoutClick,
  } = props;

  return (
    <List>
      <ListItem
        button
        component={Link}
        to="/"
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('dashboard:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/people/"
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('people:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/groups/"
      >
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('groups:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/notes/"
      >
        <ListItemIcon>
          <NotesIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('notes:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/photos/"
      >
        <ListItemIcon>
          <PhotosIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('photos:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/topics/"
      >
        <ListItemIcon>
          <TopicsIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('topics:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/articles/"
      >
        <ListItemIcon>
          <ArticlesIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('articles:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/hashtags/"
      >
        <ListItemIcon>
          <ArticlesIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('hashtags:cTitle')} />
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
          <ListItemText primary={i18n.t('auth:logout')} />
        </ListItem>
      }
    </List>
  );
};

LeftMenu.propTypes = {
  onLogoutClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

LeftMenu.defaultProps = {
  isAuthenticated: false,
};

export default LeftMenu;
