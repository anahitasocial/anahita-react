import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ActorInfoForm from '../../components/actor/InfoForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';

const BODY_CHARACTER_LIMIT = 350;

class ActorsAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: { ...ActorDefault },
      nameError: false,
      nameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
      isFetching: false,
      success: false,
      error: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    const { addActor } = this.props;
    const { actor: { name, body } } = this.state;
    addActor({ name, body });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.saveActor();
    }
  }

  render() {
    const { namespace } = this.props;
    const {
      actor,
      nameError,
      nameHelperText,
      bodyError,
      bodyHelperText,
      isFetching,
      success,
      error,
    } = this.state;

    if (success) {
      return (
        <Redirect to={`/${namespace}/${actor.id}/`} />
      );
    }

    return (
      <React.Fragment>
        <Card>
          <CardHeader
            title={actor.name}
            avatar={
              <Avatar
                aria-label={actor.name}
                alt={actor.name}
              >
                {actor.name ? actor.name.charAt(0).toUpperCase() : <GroupAddIcon />}
              </Avatar>
            }
          />
          <ActorInfoForm
            formTitle={`Add new ${singularize(namespace)}`}
            name={actor.name}
            nameError={nameError}
            nameHelperText={nameHelperText}
            body={actor.body}
            bodyError={bodyError}
            bodyHelperText={bodyHelperText}
            handleFieldChange={this.handleFieldChange}
            handleFormSubmit={this.handleFormSubmit}
            isFetching={isFetching}
            dismissPath={`/${namespace}/`}
          />
        </Card>
        {error &&
          <SimpleSnackbar
            isOpen={Boolean(error)}
            message="Something went wrong!"
            type="error"
          />
        }
      </React.Fragment>
    );
  }
}

ActorsAdd.propTypes = {
  addActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      success,
      error,
    } = state[namespace];

    return {
      actors: state[namespace][namespace],
      namespace,
      isFetching,
      success,
      error,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      addActor: (actor) => {
        return dispatch(actions[namespace].add(actor));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsAdd);
};
