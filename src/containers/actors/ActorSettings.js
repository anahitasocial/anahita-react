import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActorSettingsList from '../../components/lists/ActorSettings';
import { readActor } from '../../actions/actor';

class ActorSettingsPage extends React.Component {
  componentWillMount() {
    const { actor } = this.props;

    if (!actor.id) {
      const { id } = this.props.computedMatch.params;
      this.props.readActor(id, this.props.namespace);
    }
  }

  render() {
    const {
      actor,
      viewer,
      namespace,
    } = this.props;

    return (
      <React.Fragment>
        {actor.id &&
          <ActorSettingsList
            actor={actor}
            viewer={viewer}
            namespace={namespace}
          />
        }
      </React.Fragment>
    );
  }
}

ActorSettingsPage.propTypes = {
  readActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
  viewer: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

ActorSettingsPage.defaultProps = {
  actor: {
    id: null,
  },
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
  } = state.actorReducer;

  const {
    viewer,
  } = state.authReducer;

  return {
    actor,
    error,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(readActor(id, namespace));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsPage);
