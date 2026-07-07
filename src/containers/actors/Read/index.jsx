import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import ActorHeader from './ActorHeader';
import ActorBody from './Body';
import ActorsFollowRequests from './FollowRequests';
import ActorsSocialgraph from '../Socialgraph/index';
import ActorsBrowseFeature from '../Browse/Gadget';
import Admins from './Admins';
import Avatar from './Avatar';
import Composers from '../../media/Composer';
import ActorControls from './Controls';
import Cover from '../../cover';
import NotificationsDialog from '../Notifications/Dialog';

import ControlFollow from '../../controls/Follow';
import LocationsGadget from '../../locations/Gadget';
import MediaBrowse from '../../media/Browse';
import Progress from '../../../components/Progress';
import SocialgraphTabs from './SocialgraphTabs';
import FeedActorBrowse from '../../feed/Actor';
import HeaderMeta from '../../../components/HeaderMeta';

import actions from '../../../actions';
import i18n from '../../../languages';
import permissions from '../../../permissions/actor';
import utils from '../../../utils';
import { Actor as ACTOR } from '../../../constants';

import ActorsType from '../../../proptypes/Actors';
import PersonType from '../../../proptypes/Person';

import AddFollower from '../Socialgraph/Add';

const {
  getPortraitURL,
  getActorFeatureTabs,
} = utils.node;

const { TAB_COMPONENTS } = ACTOR;

const ActorsRead = (props) => {
  const {
    namespace,
    readItem,
    setAppTitle,
    items: {
      current: actor,
    },
    viewer,
    isAuthenticated,
    isFetching,
    error,
  } = props;

  const { id: slug, tab, subtab } = useParams();
  const [id] = slug.split('-');

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
    readItem(id);
  }, [id, namespace]);

  if (!actor.id) {
    if (isFetching) {
      return (
        <Progress />
      );
    }

    if (error !== '') {
      return (
        <Navigate to="/404/" replace />
      );
    }

    return <></>;
  }

  const canEdit = permissions.canEdit(actor);
  const canAdminister = permissions.canAdminister(actor);
  const canFollow = permissions.canFollow(actor, viewer);

  const showFollow = isAuthenticated && canFollow;
  const showAddFollower = isAuthenticated && canAdminister && !utils.node.isPerson(actor);
  const showCommands = isAuthenticated && canAdminister;
  const showEditNotifications = isAuthenticated && actor.isLeader;
  const showFollowRequests = isAuthenticated && canAdminister;
  const isViewer = actor.id === viewer.id;
  const FollowRequests = ActorsFollowRequests(namespace);
  const featureTabs = getActorFeatureTabs(actor);

  // socialgraph tabs
  const showFollowers = actor.id;
  const showLeaders = actor.id && utils.node.isPerson(actor);
  const showBlocks = isViewer;
  const showMutuals = viewer.id && viewer.id !== actor.id;

  const tabPanels = {};

  // eslint-disable-next-line no-shadow
  featureTabs.forEach((tab) => {
    const componentType = TAB_COMPONENTS[tab];

    if (componentType === 'actor') {
      tabPanels[tab] = (
        <ActorsBrowseFeature
          key={`actor-browse-${tab}`}
          owner={actor}
          queryFilters={{ oid: actor.id }}
        />
      );
    }

    if (componentType === 'medium') {
      const MediaFeature = MediaBrowse(tab);
      tabPanels[tab] = (
        <MediaFeature
          key={`medium-browse-${tab}`}
          queryFilters={{ oid: actor.id }}
        />
      );
    }
  });

  return (
    <>
      <HeaderMeta
        title={actor.name}
        description={actor.body}
        image={getPortraitURL(actor, 'large')}
      />
      <ActorHeader
        cover={
          <Cover
            node={actor}
            canEdit={canEdit}
          />
        }
        avatar={
          <Avatar
            node={actor}
            canEdit={canEdit}
          />
        }
        actor={actor}
        followAction={
          <>
            {showEditNotifications && <NotificationsDialog actor={actor} />}
            {showAddFollower && <AddFollower actor={actor} />}
            {showFollowRequests && <FollowRequests actor={actor} />}
            {showFollow && <ControlFollow actor={actor} />}
          </>
        }
        headerActions={showCommands &&
          <ActorControls
            actor={actor}
            viewer={viewer}
            isAuthenticated={isAuthenticated}
          />}
      />
      <ActorBody
        actor={actor}
        viewer={viewer}
        selectedTab={tab}
        tabPanels={tabPanels}
        admins={actor.administrators &&
          <Admins actor={actor} />}
        composers={isAuthenticated && actor.id && viewer.id &&
          <Composers
            actor={actor}
            viewer={viewer}
          />}
        feed={actor.id &&
          <FeedActorBrowse
            actor={actor}
          />}
        locations={actor.id &&
          <LocationsGadget
            node={actor}
            viewer={viewer}
          />}
        socialgraph={
          <SocialgraphTabs
            followers={showFollowers &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="followers"
              />}
            leaders={showLeaders &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="leaders"
              />}
            blocks={showBlocks &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="blocks"
              />}
            mutuals={showMutuals &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="mutuals"
              />}
            selectedTab={subtab}
          />
        }
      />
    </>
  );
};

ActorsRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  items: ActorsType.isRequired,
  viewer: PersonType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  setAppTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      error,
    } = state[namespace];

    const {
      isAuthenticated,
      viewer,
    } = state.session;

    return {
      items: state[namespace][namespace],
      namespace,
      error,
      isAuthenticated,
      viewer,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readItem: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      setAppTitle: (title) => {
        return dispatch(actions.app.setAppTitle(title));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsRead);
};
