import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ActorHeader from '../../components/actor/Header';
import ActorBody from '../../components/actor/Body';
import ActorsFollowRequests from './FollowRequests';
import ActorsSocialgraph from './Socialgraph';
import ActorsBrowse from './Browse';
import Admins from '../../components/actor/body/Admins';
import Avatar from './read/Avatar';
import Composers from '../composers/';
import Commands from './read/Commands';
import Cover from './read/Cover';
import FollowAction from '../actions/Follow';
import LocationsGadget from '../locations/Gadget';
import MediaBrowse from '../media/Browse';
import Progress from '../../components/Progress';
import SocialgraphTabs from '../../components/actor/socialgraph/Tabs';
import StoriesBrowse from '../stories/Browse';
import HeaderMeta from '../../components/HeaderMeta';

import * as actions from '../../actions';
import i18n from '../../languages';
import permissions from '../../permissions/actor';
import utils from '../../utils';
import { Node as NODE } from '../../constants';

import ActorsType from '../../proptypes/Actors';
import PersonType from '../../proptypes/Person';

const {
  isPerson,
  getPortraitURL,
} = utils.node;

const { NAMESPACES } = NODE;

const ActorsRead = (props) => {
  const {
    namespace,
    readItem,
    resetList,
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
      },
    },
  } = props;

  useEffect(() => {
    setAppTitle(i18n.t(`${namespace}:cTitle`));
    readItem(id, namespace);

    return () => {
      resetList();
    };
  }, [setAppTitle, readItem, resetList, id, namespace]);

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

    return <React.Fragment />;
  }

  // @TODO we need a custom Read container for the Project Actors at this point
  if (isPerson(actor)) {
    actor.gadgets.splice(1, 0, 'groups');
  }
  actor.gadgets.splice(1, 0, 'socialgraph');

  const canFollow = permissions.canFollow(actor);
  const canEdit = permissions.canEdit(actor);
  const canAdminister = permissions.canAdminister(actor);
  const canViewCommands = permissions.canViewCommands(actor, [
    'follow',
    'unfollow',
    'notifications-settings',
  ]);

  const isViewer = actor.id === viewer.id;
  const FollowRequests = ActorsFollowRequests(namespace);

  const gadgets = [];
  actor.gadgets.map((gadget) => {
    if (NAMESPACES.ACTOR.includes(gadget)) {
      const ActorsGadget = ActorsBrowse(gadget);
      gadgets[gadget] = (<ActorsGadget
        key={`actor-gadget-${actor.id}`}
        queryFilters={{
          oid: actor.id,
          filter: 'administering',
          offset: 0,
          limit: 1000,
        }}
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
    <React.Fragment>
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
          <React.Fragment>
            {canAdminister && <FollowRequests actor={actor} />}
            {canFollow && <FollowAction actor={actor} />}
          </React.Fragment>
        }
        headerActions={canViewCommands &&
          <Commands actor={actor} />
        }
      />
      <ActorBody
        actor={actor}
        viewer={viewer}
        admins={actor.id > 0 && actor.administrators &&
          <Admins actor={actor} />
        }
        composers={isAuthenticated && actor.id &&
          <Composers owner={actor} />
        }
        stories={actor.id &&
          <StoriesBrowse
            queryFilters={{
              oid: actor.id,
            }}
          />
        }
        locations={actor.id &&
          <LocationsGadget node={actor} />
        }
        socialgraph={
          <SocialgraphTabs
            followers={actor.id &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="followers"
              />
            }
            leaders={actor.id && isPerson(actor) &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="leaders"
              />
            }
            blocked={actor.id && isViewer &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="blocked"
              />
            }
            mutuals={actor.id && !isViewer && isPerson(actor) &&
              <ActorsSocialgraph
                actorNode={actor}
                filter="mutuals"
              />
            }
          />
        }
        gadgets={gadgets}
      />
    </React.Fragment>
  );
};

ActorsRead.propTypes = {
  readItem: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
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
      resetList: () => {
        return dispatch(actions[namespace].reset());
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
