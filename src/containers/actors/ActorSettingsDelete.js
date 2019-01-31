import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Person as PERSON } from '../../constants';
import ActorDeleteForm from '../../components/ActorDeleteForm';
import ActorSettingCard from '../../components/cards/ActorSetting';
import * as actions from '../../actions/actor';

import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';

const styles = (theme) => {
  return {
    progress: {
      marginLeft: '48%',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
    },
  };
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
      const { readActor } = this.props;

      readActor(id, namespace);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      actor: { ...nextProps.actor },
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
    const {
      actor,
      viewer,
    } = this.props;


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
      <React.Fragment>
        {!actor.id &&
          <CircularProgress className={classes.progress} />
        }
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
      </React.Fragment>
    );
  }
}

ActorSettingsDeletePage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  deleteActor: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  namespace: PropTypes.string.isRequired,
  error: PropTypes.string,
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
  viewer: PersonType.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

ActorSettingsDeletePage.defaultProps = {
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
  } = state.actor;

  const {
    viewer,
  } = state.auth;

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
      dispatch(actions.read(id, namespace));
    },
    deleteActor: (actor) => {
      dispatch(actions.deleteActor(actor));
    },
  };
};

export default withStyles(styles)(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsDeletePage)));
