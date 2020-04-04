import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActorSettingsList from '../../components/lists/ActorSettings';
import Progress from '../../components/Progress';
import * as actions from '../../actions';
import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';
import PersonType from '../../proptypes/Person';

const ActorSettings = (props) => {
  const {
    readActor,
    actors: {
      current: actor = { ...ActorDefault },
    },
    resetActors,
    viewer,
    namespace,
    computedMatch: {
      params,
    },
    isFetching,
  } = props;

  const [id] = params.id.split('-');

  useEffect(() => {
    readActor(id, namespace);

    return () => {
      resetActors();
    };
  }, []);

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }
  return (
    <ActorSettingsList
      actor={actor}
      viewer={viewer}
      namespace={namespace}
      isFetching={isFetching}
    />
  );
};

ActorSettings.propTypes = {
  readActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  resetActors: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  namespace: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      error,
    } = state[namespace];

    const {
      viewer,
    } = state.session;

    return {
      actors: state[namespace][namespace],
      namespace,
      isFetching,
      error,
      viewer,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readActor: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        return dispatch(actions[namespace].reset());
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorSettings);
};
