import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PersonAccountForm from '../../components/PersonAccountForm';
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

class PersonSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    const { actor } = this.props;
    if (!actor) {
      const { id } = this.props.match.params;
      this.props.readActor(id, 'people');
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
    const {
      username,
      email,
      password,
    } = this.state.actor;

    this.setState({
      hasUsername: Boolean(username),
      hasEmail: Boolean(email),
      hasPassword: Boolean(password),
    });

    return Boolean(username) && Boolean(email) && Boolean(password);
  }

  saveActor() {
    const { actor } = this.state;
    this.props.editActor(actor, 'people');
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
    } = this.props;

    const {
      hasUsername,
      hasEmail,
      hasPassword,
      actor,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor &&
          <ActorSettingCard
            namespace="people"
            actor={actor}
          >
            <PersonAccountForm
              hasUsername={hasUsername}
              hasEmail={hasEmail}
              hasPassword={hasPassword}
              username={actor.username}
              email={actor.email}
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
  readActor: PropTypes.func.isRequired,
  editActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
};

PersonSettingsInfoPage.defaultProps = {
  actor: null,
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
    readActor: (id, namespace) => {
      dispatch(readActor(id, namespace));
    },
    editActor: (params, namespace) => {
      dispatch(editActor(params, namespace));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonSettingsInfoPage));
