import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import ActorInfoForm from '../../components/ActorInfoForm';
import ActorSettingCard from '../../components/cards/ActorSetting';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import actions from '../../actions/actor';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';

const BODY_CHARACTER_LIMIT = 1000;

class ActorSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: ActorDefault,
      nameError: false,
      nameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
    };

    const {
      computedMatch: {
        params,
      },
    } = props;
    const [id] = params.id.split('-');
    this.id = id;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    const { editActor } = this.props;

    editActor(actor);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.saveActor();
    }
  }

  render() {
    const {
      namespace,
      isFetching,
      success,
      error,
    } = this.props;

    const {
      actor,
      nameError,
      nameHelperText,
      bodyError,
      bodyHelperText,
    } = this.state;

    return (
      <React.Fragment>
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
            dismissPath={`/${namespace}/${actor.id}/settings/`}
          />
        </ActorSettingCard>
        {error &&
          <SimpleSnackbar
            isOpen={Boolean(error)}
            message="Something went wrong!"
            type="error"
          />
        }
        {success &&
          <SimpleSnackbar
            isOpen={Boolean(success)}
            message="Information Updated!"
            type="success"
          />
        }
      </React.Fragment>
    );
  }
}

ActorSettingsInfoPage.propTypes = {
  readActor: PropTypes.func.isRequired,
  editActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  computedMatch: PropTypes.object.isRequired,
};

ActorSettingsInfoPage.defaultProps = {
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actors,
    success,
    error,
    isFetching,
  } = state.actors;

  return {
    actors,
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
    editActor: (actor) => {
      dispatch(actions.edit(actor));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsInfoPage);
