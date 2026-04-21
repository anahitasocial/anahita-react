import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useSelector } from 'react-redux';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import AuthenticatedRoute from './AuthenticatedRoute';

import AuthPage from '../containers/auth';
import AuthToken from '../containers/auth/Token';
import PasswordResetPage from '../containers/auth/PasswordReset';

import HomePage from '../containers/home';

import Actors from '../containers/actors';
import ActorsRead from '../containers/actors/read';
import ActorsAdd from '../containers/actors/Add';
import ActorsSettings from '../containers/actors/settings';
import ActorsNotificationsEdit from '../containers/actors/notifications/Edit';

import Blogs from '../containers/blogs';

import Hashtags from '../containers/hashtags';
import HashtagsRead from '../containers/hashtags/Read';

import Locations from '../containers/locations';
import LocationsRead from '../containers/locations/Read';

import Media from '../containers/media';
import MediaRead from '../containers/media/Read';

import Notifications from '../containers/notifications';

import OAuthCallback from '../containers/OAuthCallback';
import OAuthClients from '../containers/oauth/Clients';

import People from '../containers/people';
import PeopleAdd from '../containers/people/Add';

import DashboardPage from '../containers/Dashboard';
import ExplorePage from '../containers/Explore';
import SearchPage from '../containers/search';
import Settings from '../containers/settings';
import StaticPage from '../containers/page';
import NotFoundPage from '../containers/NotFound';

const GroupsBrowse = Actors('groups');
const GroupsRead = ActorsRead('groups');
const GroupsAdd = ActorsAdd('groups');
const GroupsSettings = ActorsSettings('groups');
const GroupsNotificationsEdit = ActorsNotificationsEdit('groups');

const PeopleRead = ActorsRead('people');
const PeopleSettings = ActorsSettings('people');
const PeopleNotificationsEdit = ActorsNotificationsEdit('people');

const Articles = Media('articles');
const ArticlesRead = MediaRead('articles');

const Documents = Media('documents');
const DocumentsRead = MediaRead('documents');

const Notes = Media('notes');
const NotesRead = MediaRead('notes');

const Photos = Media('photos');
const PhotosRead = MediaRead('photos');

const Topics = Media('topics');
const TopicsRead = MediaRead('topics');

function AppRoutes() {
  const isAuthenticated = useSelector((state) => {
    return state.session.isAuthenticated;
  });
  const location = useLocation();

  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
        debug: process.env.NODE_ENV === 'development' && false,
      });
    }
  }, []);

  useEffect(() => {
    if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      <Route
        path="/"
        element={isAuthenticated ? <DashboardPage /> : <HomePage />}
      />

      <Route
        path="/about"
        element={
          <AuthenticatedRoute>
            <HomePage />
          </AuthenticatedRoute>
        }
      />

      <Route path="/blogs" element={<Blogs />} />

      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/explore/:tab" element={<ExplorePage />} />

      <Route path="/search" element={<SearchPage />} />

      <Route
        path="/token/:token/resetpassword"
        element={<AuthToken resetPassword />}
      />
      <Route path="/token/:token" element={<AuthToken />} />

      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/:tab" element={<AuthPage />} />

      <Route path="/passwordreset" element={<PasswordResetPage />} />

      <Route
        path="/dashboard"
        element={
          <AuthenticatedRoute>
            <DashboardPage />
          </AuthenticatedRoute>
        }
      />

      {/* People — static paths before parameterized */}
      <Route path="/people" element={<People />} />
      <Route
        path="/people/add"
        element={
          <AuthenticatedRoute>
            <PeopleAdd />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/people/:id/settings/account"
        element={
          <AuthenticatedRoute>
            <PeopleSettings selectedTab="account" />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/people/:id/settings"
        element={
          <AuthenticatedRoute>
            <PeopleSettings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/people/:id/notifications"
        element={
          <AuthenticatedRoute>
            <PeopleNotificationsEdit />
          </AuthenticatedRoute>
        }
      />
      <Route path="/people/:id/:tab/:subtab" element={<PeopleRead />} />
      <Route path="/people/:id" element={<PeopleRead />} />

      {/* Groups — static paths before parameterized */}
      <Route path="/groups" element={<GroupsBrowse />} />
      <Route
        path="/groups/add"
        element={
          <AuthenticatedRoute>
            <GroupsAdd />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/groups/:id/settings"
        element={
          <AuthenticatedRoute>
            <GroupsSettings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/groups/:id/notifications"
        element={
          <AuthenticatedRoute>
            <GroupsNotificationsEdit />
          </AuthenticatedRoute>
        }
      />
      <Route path="/groups/:id/:tab/:subtab" element={<GroupsRead />} />
      <Route path="/groups/:id" element={<GroupsRead />} />

      <Route
        path="/notifications"
        element={
          <AuthenticatedRoute>
            <Notifications />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthenticatedRoute>
            <Settings />
          </AuthenticatedRoute>
        }
      />

      {/* Media types */}
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticlesRead />} />

      <Route path="/documents" element={<Documents />} />
      <Route path="/documents/:id" element={<DocumentsRead />} />

      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/:id" element={<NotesRead />} />

      <Route path="/photos" element={<Photos />} />
      <Route path="/photos/:id" element={<PhotosRead />} />

      <Route path="/topics" element={<Topics />} />
      <Route path="/topics/:id" element={<TopicsRead />} />

      <Route path="/hashtags" element={<Hashtags />} />
      <Route path="/hashtags/:alias" element={<HashtagsRead />} />

      <Route path="/locations" element={<Locations />} />
      <Route path="/locations/:id" element={<LocationsRead />} />

      <Route path="/settings/clients" element={<OAuthClients />} />

      <Route path="/pages/:alias" element={<StaticPage />} />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
