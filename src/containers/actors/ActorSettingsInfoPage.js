import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { singularize } from 'inflected';
import ActorInfoForm from '../../components/ActorInfoForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import {
  readActor,
  editActor,
} from '../../actions/actor';

const styles = {
  root: {
    width: '100%',
  },
};

const BODY_CHARACTER_LIMIT = 350;

class ActorSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
      nameError: false,
      nameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.actor.id) {
      this.setState({
        actor: Object.assign({}, nextProps.actor),
      });
    }
  }

  handleFieldChange(event) {
    const { actor } = this.state;
    const { name, value } = event.target;

    this.validateField(name, value.trim());
    actor[name] = value;

    this.setState({ actor });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    switch (name) {
      case 'name':
        if (value.length < 6) {
          fieldError.error = true;
          fieldError.helperText = 'At least 6 characters are required!';
        }
        break;
      case 'body':
        if (value.length > BODY_CHARACTER_LIMIT) {
          fieldError.error = true;
          fieldError.helperText = `You have exceeded the ${BODY_CHARACTER_LIMIT} character limit!`;
        }
        break;
      default:
        if (value === '') {
          fieldError.error = true;
          fieldError.helperText = 'This field is required!';
        }
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return !fieldError.error;
  }

  validate() {
    const { name, body } = this.state.actor;
    const nameValidated = this.validateField('name', name);
    const bodyValidated = this.validateField('body', body);

    return nameValidated && bodyValidated;
  }

  saveActor() {
    const { actor } = this.state;
    this.props.editActor(actor);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.saveActor();
    }
  }

  render() {
    const {
      classes,
      namespace,
      isFetching,
      success,
    } = this.props;

    const {
      actor,
      nameError,
      nameHelperText,
      bodyError,
      bodyHelperText,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor.id &&
          <ActorSettingCard
            namespace={namespace}
            actor={actor}
          >
            <ActorInfoForm
              formTitle={`${singularize(namespace)} Information`}
              name={actor.name}
              nameError={nameError}
              nameHelperText={nameHelperText}
              body={actor.body}
              bodyError={bodyError}
              bodyHelperText={bodyHelperText}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              isFetching={isFetching}
              success={success}
              dismissPath={`/${namespace}/${actor.id}/settings/`}
            />
          </ActorSettingCard>
        }
      </div>
    );
  }
}

ActorSettingsInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  editActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool,
};

ActorSettingsInfoPage.defaultProps = {
  actor: {
    name: '',
    body: '',
  },
  isFetching: false,
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    error,
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
    editActor: (actor) => {
      dispatch(editActor(actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsInfoPage));
