import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActorSettingsList from '../../components/lists/ActorSettings';
import actions from '../../actions/actor';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';
import PersonType from '../../proptypes/Person';

class ActorSettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: ActorDefault,
    };

    const {
      computedMatch: {
        params,
      },
    } = props;
    const [id] = params.id.split('-');
    this.id = id;
  }

  componentWillMount() {
    const { namespace, readActor } = this.props;
    readActor(this.id, namespace);
  }

  componentWillReceiveProps(nextProps) {
    const { actors } = nextProps;
    this.setState({
      actor: actors.current,
    });
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

    const { actor } = this.state;

    return (
      <ActorSettingsList
        actor={actor}
        viewer={viewer}
        namespace={namespace}
      />
    );
  }
}

ActorSettingsPage.propTypes = {
  readActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  resetActors: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  namespace: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
  // isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    actors,
    error,
    isFetching,
  } = state.actors;

  const {
    viewer,
  } = state.auth;

  return {
    actors,
    isFetching,
    error,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(actions.read(id, namespace));
    },
    resetActors: () => {
      dispatch(actions.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsPage);
