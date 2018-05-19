import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ActorInfoForm from '../../components/ActorInfoForm';
import { addActor } from '../../actions/actor';

const styles = {
  root: {
    width: '100%',
  },
};

const BODY_CHARACTER_LIMIT = 350;

class ActorAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: {
        id: null,
        name: '',
        body: '',
      },
      nameError: false,
      nameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      actor: Object.assign({}, nextProps.actor),
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
    const { namespace } = this.props;
    this.props.addActor(actor, namespace);
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
      success,
      isFetching,
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
        <Card>
          <CardHeader
            title={actor.name}
            avatar={
              <Avatar
                aria-label={actor.name || ''}
                className={classes.avatar}
                alt={actor.name || ''}
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
            success={success}
            dismissPath={`/${namespace}/`}
          />
        </Card>
        {success && actor.id &&
          <Redirect to={`/${namespace}/${actor.id}/`} />
        }
      </div>
    );
  }
}

ActorAddPage.propTypes = {
  classes: PropTypes.object.isRequired,
  addActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    isFetching,
  } = state.actorReducer;

  return {
    actor,
    success,
    isFetching,
  };
};

ActorAddPage.defaultProps = {
  actor: {
    id: null,
    name: '',
    body: '',
  },
  isFetching: false,
  success: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    addActor: (actor, namespace) => {
      dispatch(addActor(actor, namespace));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorAddPage));
