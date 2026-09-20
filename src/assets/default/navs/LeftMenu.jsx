import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import BlogsIcon from '@material-ui/icons/RssFeedOutlined';
import HomeIcon from '@material-ui/icons/Home';
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
import SignupRequestsIcon from '@material-ui/icons/HowToReg';
import InvitesIcon from '@material-ui/icons/MailOutline';
import LegalIcon from '@material-ui/icons/MenuBook';
import SupportIcon from '@material-ui/icons/ContactSupport';
import AboutIcon from '@material-ui/icons/Info';

import { Link, useLocation } from 'react-router-dom';

import i18n from '../../../languages';
import PersonType from '../../../proptypes/Person';
import NodeInfoType from '../../../proptypes/NodeInfo';
import permissions from '../../../permissions';

const LeftMenu = ({
  isAuthenticated,
  viewer,
  nodeInfo = null,
  onLogoutClick = null,
}) => {
  const location = useLocation();
  const { pathname = '/' } = location;

  // Who may invite is a server setting, published through NodeInfo.
  // Undefined until that answers, which ranks as "nobody" — so the
  // entry appears once the answer arrives rather than flashing in and
  // out for somebody who cannot use it.
  const invitesFrom = nodeInfo && nodeInfo.metadata && nodeInfo.metadata.invitesFrom;

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
      {/* Three separate gates, not one, because the three pages answer
          to three different rules. The queue is administrator-level,
          settings is super admin, and invites is whatever INVITES_FROM
          says — which is why that one is the only gate here that needs
          an answer from the server.

          Invites is gated on canAdd rather than canBrowse. Anybody
          registered may READ their own list, but a page that can only
          ever be empty is not worth a permanent menu entry; somebody
          who still has invitations from before a tightening can reach
          /invites directly. */}
      {isAuthenticated && permissions.signupRequest.canBrowse(viewer) &&
        <ListItem
          button
          component={Link}
          to="/signup-requests"
          selected={pathname === '/signup-requests'}
        >
          <ListItemIcon>
            <SignupRequestsIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('signupRequests:mTitle')} />
        </ListItem>}
      {isAuthenticated && permissions.invite.canAdd(viewer, invitesFrom) &&
        <ListItem
          button
          component={Link}
          to="/invites"
          selected={pathname === '/invites'}
        >
          <ListItemIcon>
            <InvitesIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.t('invites:mTitle')} />
        </ListItem>}
      {isAuthenticated && permissions.settings.canBrowse(viewer) &&
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
      {/* <ListItem
        button
        component={Link}
        to="/blogs/"
        selected={pathname === '/blogs/'}
      >
        <ListItemIcon>
          <BlogsIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('blogs:cTitle')} />
      </ListItem> */}
      {/* Public, for everybody signed in or not. Support is where somebody
          who cannot sign in is sent, the terms are read before an account
          exists, and About is how a stranger decides whether to ask for one
          — hiding any of them behind authentication hides them from the
          people they are for. */}
      <ListItem
        button
        component={Link}
        to="/about"
        selected={pathname === '/about'}
      >
        <ListItemIcon>
          <AboutIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('about:mTitle')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/support"
        selected={pathname === '/support'}
      >
        <ListItemIcon>
          <SupportIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('pages:support')} />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/legal/tos"
        selected={pathname.startsWith('/legal')}
      >
        <ListItemIcon>
          <LegalIcon />
        </ListItemIcon>
        <ListItemText primary={i18n.t('legal:mTitle')} />
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
        </ListItem>}
    </List>
  );
};

LeftMenu.propTypes = {
  onLogoutClick: PropTypes.func,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  nodeInfo: NodeInfoType,
};

export default LeftMenu;
