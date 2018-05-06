import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { Person as PERSON } from '../../constants';
import ActorDeleteForm from '../../components/ActorDeleteForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import {
  readActor,
  deleteActor,
} from '../../actions/actor';

const styles = {
  root: {
    width: '100%',
  },
};

class ActorSettingsDeletePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
      alias: '',
      aliasError: false,
      aliasHelperText: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    const { actor, namespace } = this.props;

    if (!actor.id) {
      const { id } = this.props.computedMatch.params;
      this.props.readActor(id, namespace);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      actor: Object.assign({}, nextProps.actor),
    });
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
    this.props.deleteActor(actor);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.deleteActor();
    }
  }

  canDelete() {
    const {
      actor,
      viewer,
    } = this.props;


    if (viewer.type === PERSON.TYPE.SUPER_ADMIN) {
      if (viewer.id === actor.id) {
        return false;
      }
    }

    if (viewer.usertype === PERSON.TYPE.ADMIN) {
      if (actor.objecttype === 'com:people:person') {
        if (actor.usertype === PERSON.TYPE.SUPER_ADMIN) {
          return false;
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
        return false;
      }
    }

    return false;
  }

  render() {
    const {
      classes,
      namespace,
      isFetching,
      error,
      success,
    } = this.props;

    const {
      actor,
      alias,
      aliasError,
      aliasHelperText,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor.id &&
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
        }
        {success && !actor.id &&
          <Redirect to={`/${namespace}/`} />
        }
      </div>
    );
  }
}

ActorSettingsDeletePage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  deleteActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
  namespace: PropTypes.string.isRequired,
  error: PropTypes.string,
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
  viewer: PropTypes.object.isRequired,
};

ActorSettingsDeletePage.defaultProps = {
  actor: {
    id: null,
    alias: '',
  },
  isFetching: false,
  error: '',
  success: false,
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
    success,
    isFetching,
  } = state.actorReducer;

  const {
    viewer,
  } = state.authReducer;

  return {
    actor,
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(readActor(id, namespace));
    },
    deleteActor: (actor) => {
      dispatch(deleteActor(actor));
    },
  };
};

export default withStyles(styles)(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsDeletePage)));
