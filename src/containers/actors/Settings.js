import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActorSettingsList from '../../components/lists/ActorSettings';
import * as actions from '../../actions';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';
import PersonType from '../../proptypes/Person';

class ActorSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: { ...ActorDefault },
      isFetching: false,
    };

    const {
      namespace,
      readActor,
      computedMatch: {
        params,
      },
    } = props;
    const [id] = params.id.split('-');

    readActor(id, namespace);
  }

  static getDerivedStateFromProps(nextProps) {
    const { actors, isFetching } = nextProps;
    return {
      actor: actors.current,
      isFetching,
    };
  }

  componentWillUnmount() {
    const { resetActors } = this.props;
    resetActors();
  }

  render() {
    const {
      viewer,
      namespace,
    } = this.props;

    const { actor, isFetching } = this.state;

    return (
      <ActorSettingsList
        actor={actor}
        viewer={viewer}
        namespace={namespace}
        isFetching={isFetching}
      />
    );
  }
}

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
        dispatch(actions[namespace].read(id, namespace));
      },
      resetActors: () => {
        dispatch(actions[namespace].reset());
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
