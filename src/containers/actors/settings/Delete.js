import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Person as PERSON } from '../../../constants';
import ActorDeleteForm from '../../../components/actor/DeleteForm';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import * as actions from '../../../actions';

import ActorsType from '../../../proptypes/Actors';
import ActorDefault from '../../../proptypes/ActorDefault';
import PersonType from '../../../proptypes/Person';

class ActorsSettingsDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: { ...ActorDefault },
      alias: '',
      aliasError: false,
      aliasHelperText: '',
      isFetching: false,
      success: false,
      error: '',
    };

    const {
      computedMatch: {
        params: {
          id,
        },
      },
    } = props;
    this.id = id;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount() {
    const { readActor } = this.props;
    readActor(this.id);
  }

  componentWillReceiveProps(nextProps) {
    const {
      actors,
      isFetching,
      success,
      error,
    } = nextProps;

    this.setState({
      actor: actors.current,
      isFetching,
      success,
      error,
    });
  }

  componentWillUnmount() {
    const { resetActors } = this.props;
    resetActors();
  }

  handleFieldChange(event) {
    const { name, value } = event.target;
    this.validateField(name, value);
    this.setState({
      alias: value,
    });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    const { alias } = this.state.actor;

    if (value === '' || value !== alias) {
      fieldError.error = true;
      fieldError.helperText = 'You must type the exact alias to delete this profile!';
    }

    if (value === alias) {
      fieldError.error = false;
      fieldError.helperText = 'This is the correct alias!';
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return !fieldError.error;
  }

  validate() {
    const { alias } = this.state;
    const aliasValidated = this.validateField('alias', alias);
    return aliasValidated;
  }

  deleteActor() {
    const { actor } = this.state;
    const { deleteActor } = this.props;

    deleteActor(actor);
  }

  handleDelete() {
    if (this.validate()) {
      this.deleteActor();
    }
  }

  canDelete() {
    const { viewer } = this.props;
    const { actor } = this.state;

    if (viewer.type !== PERSON.TYPE.SUPER_ADMIN) {
      if (viewer.id === actor.id) {
        return true;
      }
    }

    if (viewer.usertype === PERSON.TYPE.ADMIN) {
      if (actor.objecttype === 'com:people:person') {
        if (actor.usertype !== PERSON.TYPE.SUPER_ADMIN) {
          return true;
        }
      }
    }

    if ([
      PERSON.TYPE.ADMIN,
      PERSON.TYPE.SUPER_ADMIN,
    ].includes(viewer.usertype)) {
      return true;
    }

    if (actor.administratorIds) {
      if (actor.administratorIds.indexOf(String(viewer.id)) > -1) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { namespace } = this.props;
    const {
      actor,
      alias,
      aliasError,
      aliasHelperText,
      isFetching,
      success,
      error,
    } = this.state;

    if (success) {
      return (
        <Redirect to={`/${namespace}/`} />
      );
    }

    return (
      <ActorSettingCard
        namespace={namespace}
        actor={actor}
      >
        <ActorDeleteForm
          referenceAlias={actor.alias}
          alias={alias}
          aliasError={aliasError}
          aliasHelperText={aliasHelperText}
          canDelete={this.canDelete()}
          isFetching={isFetching}
          error={error}
          handleFieldChange={this.handleFieldChange}
          handleDelete={this.handleDelete}
          dismissPath={`/${namespace}/${actor.id}/settings/`}
        />
      </ActorSettingCard>
    );
  }
}

ActorsSettingsDelete.propTypes = {
  readActor: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  deleteActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      error,
      success,
      isFetching,
    } = state[namespace];

    const {
      viewer,
    } = state.auth;

    return {
      actors: state[namespace][namespace],
      namespace,
      viewer,
      isFetching,
      success,
      error,
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
      deleteActor: (actor) => {
        return dispatch(actions[namespace].deleteItem(actor));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsDelete);
};
