import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Person as PERSON } from '../../../constants';
import ActorDeleteForm from '../../../components/actor/DeleteForm';
import ActorSettingCard from '../../../components/cards/ActorSetting';
import actions from '../../../actions/actor';

import ActorsType from '../../../proptypes/Actors';
import ActorDefault from '../../../proptypes/ActorDefault';
import PersonType from '../../../proptypes/Person';

class ActorsSettingsDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: ActorDefault,
      alias: '',
      aliasError: false,
      aliasHelperText: '',
    };

    const {
      match: {
        params: {
          id,
        },
      },
    } = props;
    this.id = id;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    const { namespace, readActor } = this.props;
    readActor(this.id, namespace);
  }

  componentWillReceiveProps(nextProps) {
    const {
      actors,
      history,
      namespace,
      success,
    } = nextProps;

    if (success) {
      history.push(`/${namespace}/`);
    }

    this.setState({
      actor: actors.current,
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

  handleFormSubmit(event) {
    event.preventDefault();
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
    const {
      namespace,
      isFetching,
      error,
    } = this.props;

    const {
      actor,
      alias,
      aliasError,
      aliasHelperText,
    } = this.state;

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
          handleFormSubmit={this.handleFormSubmit}
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
  error: PropTypes.string,
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
  viewer: PersonType.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

ActorsSettingsDelete.defaultProps = {
  isFetching: false,
  error: '',
  success: false,
};

const mapStateToProps = (state) => {
  const {
    actors,
    error,
    success,
    isFetching,
  } = state.actors;

  const {
    viewer,
  } = state.auth;

  return {
    actors,
    viewer,
    error,
    success,
    isFetching,
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
    deleteActor: (actor) => {
      dispatch(actions.deleteActor(actor));
    },
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsSettingsDelete));
