import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DocumentsIcon from '@material-ui/icons/PictureAsPdf';
import BlogsIcon from '@material-ui/icons/RssFeedOutlined';
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleIcon from '@material-ui/icons/People';
import GroupsIcon from '@material-ui/icons/GroupWork';
import NotesIcon from '@material-ui/icons/Note';
import PhotosIcon from '@material-ui/icons/Photo';
import TopicsIcon from '@material-ui/icons/QuestionAnswer';
import ArticlesIcon from '@material-ui/icons/LibraryBooks';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LabelIcon from '@material-ui/icons/Label';
import LocationIcon from '@material-ui/icons/LocationOn';
import SettingsIcon from '@material-ui/icons/Settings';

import { Link, withRouter } from 'react-router-dom';

import NotificationsIcon from '../containers/notifications/Icon';
import i18n from '../languages';
import PersonType from '../proptypes/Person';
import permissions from '../permissions';

const LeftMenu = (props) => {
  const {
    isAuthenticated,
    viewer,
    onLogoutClick,
    location: {
      pathname,
    },
  } = props;

  return (
    <List>
      <ListItem
        button
        component={Link}
        to="/"
        selected={pathname === '/'}
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary={isAuthenticated ? i18n.t('dashboard:cTitle') : i18n.t('home:cTitle')} />
      </ListItem>
      {isAuthenticated &&
        <ListItem
          button
          component={Link}
          to="/notifications/"
          selected={pathname === '/notifications/'}
        >
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('notifications:cTitle')} />
        </ListItem>
      }
      <ListItem
        button
        component={Link}
        to="/explore/"
        selected={pathname === '/explore/'}
      >
        <ListItemIcon>
          <ExploreIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('explore:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/people/"
        selected={pathname === '/people/'}
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
        selected={pathname === '/groups/'}
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
        selected={pathname === '/notes/'}
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
        selected={pathname === '/photos/'}
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
        selected={pathname === '/topics/'}
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
        selected={pathname === '/articles/'}
      >
        <ListItemIcon>
          <ArticlesIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('articles:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/documents/"
        selected={pathname === '/documents/'}
      >
        <ListItemIcon>
          <DocumentsIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('documents:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/hashtags/"
        selected={pathname === '/hashtags/'}
      >
        <ListItemIcon>
          <LabelIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('hashtags:cTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/locations/"
        selected={pathname === '/locations/'}
      >
        <ListItemIcon>
          <LocationIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('locations:cTitle')} />
      </ListItem>
      {isAuthenticated && permissions.settings.canEdit(viewer) &&
        <ListItem
          button
          component={Link}
          to="/settings/"
          selected={pathname === '/settings/'}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('settings:mTitle')} />
        </ListItem>
      }
      <ListItem
        button
        component={Link}
        to="/blogs/"
        selected={pathname === '/blogs/'}
      >
        <ListItemIcon>
          <BlogsIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('blogs:cTitle')} />
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
  onLogoutClick: PropTypes.func,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

LeftMenu.defaultProps = {
  onLogoutClick: null,
};

export default withRouter(LeftMenu);
