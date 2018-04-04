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
      hasGivenName: true,
      hasFamilyName: true,
      actor: props.actor,
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
      [`has${name.toUpperCase()}`]: Boolean(value),
    });
  }

  validate() {
    const { givenName, familyName } = this.state.actor;

    this.setState({
      hasGivenName: Boolean(givenName),
      hasFamilyName: Boolean(familyName),
    });

    return Boolean(givenName) && Boolean(familyName);
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
    const { classes, viewer } = this.props;
    const {
      hasGivenName,
      hasFamilyName,
      hasGender,
      actor,
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
              hasGivenName={hasGivenName}
              hasFamilyName={hasFamilyName}
              hasGender={hasGender}
              givenName={actor.givenName}
              familyName={actor.familyName}
              body={actor.body}
              gender={actor.gender}
              usertype={actor.usertype}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
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
};

PersonSettingsInfoPage.defaultProps = {
  actor: {},
  success: false,
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
