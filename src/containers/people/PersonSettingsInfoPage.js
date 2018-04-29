import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PersonInfoForm from '../../components/PersonInfoForm';
import ActorSettingCard from '../../components/cards/ActorSettingCard';
import { readActor } from '../../actions/actor';
import { editPerson } from '../../actions/person';
import { Person as PERSON } from '../../constants';

const styles = {
  root: {
    width: '100%',
  },
};

class PersonSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
      givenNameError: false,
      familyNameError: false,
      bodyError: false,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    const { actor } = this.props;
    if (!actor.id) {
      const { id } = this.props.match.params;
      this.props.readPerson(id);
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
    actor[name] = value;
    this.setState({
      actor,
      [`${name}Error`]: value === '',
      [`${name}HelperText`]: value === '' ? actor[[`${name}HelperText`]] : '',
    });
  }

  validate() {
    const {
      givenName,
      familyName,
      body,
    } = this.state.actor;

    const givenNameError = givenName.length < 3;
    const givenNameHelperText = givenNameError ? 'First name of at least 3 characters is required!' : '';

    const familyNameError = familyName.length < 3;
    const familyNameHelperText = familyNameError ? 'Last name of at least 3 characters is required!' : '';

    const bodyError = body === '';
    const bodyHelperText = bodyError ? 'Last name of at least 3 characters is required!' : '';


    this.setState({
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      bodyError,
      bodyHelperText,
    });

    return !(
      givenNameError ||
      familyNameError ||
      bodyError
    );
  }

  saveActor() {
    const { actor } = this.state;
    this.props.editPerson(actor);
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
      viewer,
      error,
      isFetching,
    } = this.props;

    const {
      actor,
      givenNameError,
      givenNameHelperText,
      familyNameError,
      familyNameHelperText,
      bodyError,
      bodyHelperText,
      genderError,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor.id &&
          <ActorSettingCard
            namespace="people"
            actor={actor}
          >
            <PersonInfoForm
              isSuperAdmin={viewer.usertype === PERSON.TYPE.SUPER_ADMIN}
              givenNameError={givenNameError}
              givenNameHelperText={givenNameHelperText}
              familyNameError={familyNameError}
              familyNameHelperText={familyNameHelperText}
              bodyError={bodyError}
              bodyHelperText={bodyHelperText}
              genderError={genderError}
              givenName={actor.givenName}
              familyName={actor.familyName}
              body={actor.body}
              gender={actor.gender}
              usertype={actor.usertype}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              isFetching={isFetching}
              error={error}
              dismissPath={`/people/${actor.id}/settings/`}
            />
          </ActorSettingCard>
        }
      </div>
    );
  }
}

PersonSettingsInfoPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readPerson: PropTypes.func.isRequired,
  editPerson: PropTypes.func.isRequired,
  actor: PropTypes.object,
  viewer: PropTypes.object.isRequired,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
};

PersonSettingsInfoPage.defaultProps = {
  actor: {
    givenName: '',
    familyName: '',
    gender: '',
    usertype: PERSON.TYPE.REGISTERED,
  },
  success: false,
  isFetching: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    error,
  } = state.actorReducer;

  const {
    viewer,
  } = state.authReducer;

  return {
    actor,
    error,
    success,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(readActor(id, 'people'));
    },
    editPerson: (person) => {
      dispatch(editPerson(person));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfoPage));
