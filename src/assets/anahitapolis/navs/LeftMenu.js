import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import BlogsIcon from '@material-ui/icons/RssFeedOutlined';
import HomeIcon from '@material-ui/icons/Home';
import AboutIcon from '@material-ui/icons/Info';
import ExploreIcon from '@material-ui/icons/Explore';
import JoinIcon from '@material-ui/icons/AssignmentInd';
import LegalIcon from '@material-ui/icons/Description';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SettingsIcon from '@material-ui/icons/Settings';

import { Link, withRouter } from 'react-router-dom';

import NotificationsIcon from '../../../containers/notifications/Icon';
import i18n from '../../../languages';
import PersonType from '../../../proptypes/Person';
import permissions from '../../../permissions';

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
    <nav>
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
          </ListItem>}
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
        {isAuthenticated &&
          <ListItem
            button
            component={Link}
            to="/about/"
            selected={pathname === '/about/'}
          >
            <ListItemIcon>
              <AboutIcon />
            </ListItemIcon>
            <ListItemText primary={i18n.t('pages:about')} />
          </ListItem>}
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
        {!isAuthenticated &&
          <ListItem
            button
            component={Link}
            to="/pages/join/"
            selected={pathname === '/pages/join/'}
          >
            <ListItemIcon>
              <JoinIcon />
            </ListItemIcon>
            <ListItemText primary={i18n.t('pages:join')} />
          </ListItem>}
        <ListItem
          button
          component={Link}
          to="/pages/privacy/"
          selected={pathname === '/pages/privacy/'}
        >
          <ListItemIcon>
            <LegalIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('pages:privacy')} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/pages/guideline/"
          selected={pathname === '/pages/guideline/'}
        >
          <ListItemIcon>
            <LegalIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('pages:guideline')} />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/pages/tos/"
          selected={pathname === '/pages/tos/'}
        >
          <ListItemIcon>
            <LegalIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('pages:tos')} />
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
          </ListItem>}
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
          </ListItem>}
      </List>
    </nav>
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
