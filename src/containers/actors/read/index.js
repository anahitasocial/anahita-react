import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import inflector from 'inflector-js';

import ActorHeader from '../../../components/actor/Header';
import ActorBody from '../../../components/actor/Body';
import ActorsFollowRequests from '../FollowRequests';
import ActorsSocialgraph from '../socialgraph/index';
import ActorsBrowseFeature from '../browse/Gadget';
import Admins from '../../../components/actor/body/Admins';
import Avatar from './Avatar';
import Composers from '../../composers';
import Commands from './Commands';
import Cover from '../../cover';
import NotificationsDialog from '../notifications/Dialog';

import FollowAction from '../../actions/Follow';
import LocationsGadget from '../../locations/Gadget';
import MediaBrowse from '../../media/Browse';
import Progress from '../../../components/Progress';
import SocialgraphTabs from '../../../components/actor/socialgraph/Tabs';
import FeedActorBrowse from '../../feed/Actor';
import HeaderMeta from '../../../components/HeaderMeta';

import actions from '../../../actions';
import i18n from '../../../languages';
import permissions from '../../../permissions/actor';
import utils from '../../../utils';
import { Actor as ACTOR } from '../../../constants';

import ActorsType from '../../../proptypes/Actors';
import PersonType from '../../../proptypes/Person';

import AddFollower from '../socialgraph/Add';

const {
  isPerson,
  getPortraitURL,
  getEnabledFeatures,
} = utils.node;

const { GADGETS } = ACTOR;

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
    match: {
      params: {
        id: slug,
        tab,
        subtab,
      },
    },
  } = props;

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
        <Redirect push to="/404/" />
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

  const actorFeatures = getEnabledFeatures(actor);

  const tabs = [];
  actorFeatures.forEach((key) => {
    const pluralKey = inflector.pluralize(key);

    if (GADGETS.ACTOR.includes(pluralKey)) {
      tabs[pluralKey] = (
        <ActorsBrowseFeature
          key={`actor-feed-${key}`}
          owner={actor}
          queryFilters={{ oid: actor.id }}
        />
      );
    }

    if (GADGETS.MEDIUM.includes(pluralKey)) {
      const MediaFeature = MediaBrowse(pluralKey);
      tabs[pluralKey] = (
        <MediaFeature
          key={`medium-feed-${key}`}
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
            {showFollow && <FollowAction actor={actor} />}
          </>
        }
        headerActions={showCommands &&
          <Commands
            actor={actor}
            viewer={viewer}
            isAuthenticated={isAuthenticated}
          />}
      />
      <ActorBody
        actor={actor}
        viewer={viewer}
        selectedTab={tab}
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
            followers={actor.id &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="followers"
              />}
            leaders={actor.id && isPerson(actor) &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="leaders"
              />}
            blocks={actor.id && (isViewer || canAdminister) &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="blocks"
              />}
            mutuals={actor.id && !isViewer &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="mutuals"
              />}
            selectedTab={subtab}
          />
        }
        tabs={tabs}
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
  match: PropTypes.object.isRequired,
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
