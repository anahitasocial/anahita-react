import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ActorHeader from '../../../components/actor/Header';
import ActorBody from '../../../components/actor/Body';
import ActorsFollowRequests from '../FollowRequests';
import ActorsSocialgraph from '../socialgraph/index';
import ActorsBrowseGadget from '../browse/Gadget';
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
import StoriesBrowse from '../../stories/Browse';
import HeaderMeta from '../../../components/HeaderMeta';

import actions from '../../../actions';
import i18n from '../../../languages';
import permissions from '../../../permissions/actor';
import utils from '../../../utils';
import { Node as NODE } from '../../../constants';

import ActorsType from '../../../proptypes/Actors';
import PersonType from '../../../proptypes/Person';

import AddFollower from '../socialgraph/Add';

const {
  isPerson,
  getPortraitURL,
} = utils.node;

const { NAMESPACES } = NODE;

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
        id,
        tab,
        subtab,
      },
    },
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
    readItem(id, namespace);
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

  // @TODO we need a custom Read container for the Project Actors at this point
  if (isPerson(actor) && !actor.gadgets.includes('groups')) {
    actor.gadgets.splice(1, 0, 'groups');
  }

  if (!actor.gadgets.includes('socialgraph')) {
    actor.gadgets.splice(1, 0, 'socialgraph');
  }

  const canFollow = permissions.canFollow(actor);
  const canEdit = permissions.canEdit(actor);
  const canAdminister = permissions.canAdminister(actor);
  const canAddFollower = permissions.canAdminister(actor) && namespace !== 'people';
  const canViewCommands = permissions.canViewCommands(actor, [
    'follow',
    'unfollow',
    'notifications-settings',
  ]);
  const canEditNotifications = isAuthenticated && actor.isLeader;

  const isViewer = actor.id === viewer.id;
  const FollowRequests = ActorsFollowRequests(namespace);

  const gadgets = [];
  actor.gadgets.map((gadget) => {
    if (NAMESPACES.ACTOR.includes(gadget)) {
      gadgets[gadget] = (<ActorsBrowseGadget
        key={`actor-gadget-${actor.id}`}
        owner={actor}
        namespace={gadget}
      />);
    }

    if (NAMESPACES.MEDIUM.includes(gadget)) {
      const MediaGadget = MediaBrowse(gadget);
      gadgets[gadget] = (<MediaGadget
        key={`medium-gadget-${actor.id}`}
        queryFilters={{ oid: actor.id }}
      />);
    }

    return true;
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
            {canEditNotifications && <NotificationsDialog actor={actor} />}
            {canAddFollower && <AddFollower actor={actor} />}
            {canAdminister && <FollowRequests actor={actor} />}
            {canFollow && <FollowAction actor={actor} />}
          </>
        }
        headerActions={canViewCommands &&
          <Commands actor={actor} viewer={viewer} />}
      />
      <ActorBody
        actor={actor}
        viewer={viewer}
        selectedTab={tab}
        admins={actor.id > 0 && actor.administrators &&
          <Admins actor={actor} />}
        composers={isAuthenticated && actor.id &&
          <Composers owner={actor} />}
        stories={actor.id &&
          <StoriesBrowse
            queryFilters={{
              oid: actor.id,
            }}
          />}
        locations={actor.id &&
          <LocationsGadget node={actor} />}
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
            blocked={actor.id && isViewer &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="blocked"
              />}
            mutuals={actor.id && !isViewer && isPerson(actor) &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="mutuals"
              />}
            selectedTab={subtab}
          />
        }
        gadgets={gadgets}
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
