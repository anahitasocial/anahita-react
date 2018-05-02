import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
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
      const { id } = this.props.match.params;
      this.props.readActor(id, namespace);
    }
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
      status: false,
      helperText: '',
    };

    const { alias } = this.state.actor;

    if (value === '' || value !== alias) {
      fieldError.status = true;
      fieldError.helperText = 'You must type the exact alias to delete this profile!';
    }

    if (value === alias) {
      fieldError.status = false;
      fieldError.helperText = 'This is the correct alias!';
    }

    this.setState({
      [`${name}Error`]: fieldError.status,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return fieldError.status;
  }

  validate() {
    const { alias } = this.state;
    const aliasError = this.validateField('alias', alias);
    return !aliasError;
  }

  deleteActor() {
    const { namespace, history } = this.props;
    const { actor } = this.state;
    this.props.deleteActor(actor);
    history.push(`/${namespace}/`);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.deleteActor();
    }
  }

  canDelete() {
    const { alias, actor } = this.state;
    return alias === actor.alias;
  }

  render() {
    const {
      classes,
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
      <div className={classes.root}>
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
  history: PropTypes.object.isRequired,
};

ActorSettingsDeletePage.defaultProps = {
  actor: {
    alias: '',
  },
  isFetching: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
    success,
    isFetching,
  } = state.actorReducer;

  return {
    actor,
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

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsDeletePage));
