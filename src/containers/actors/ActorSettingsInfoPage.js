import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
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

class ActorSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: props.actor,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    const { actor, namespace } = this.props;
    if (!actor) {
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
    actor[name] = value;
    this.setState({
      actor,
      [`has${name.toUpperCase()}`]: Boolean(value),
    });
  }

  validate() {
    const { namespace } = this.props;
    const { name, givenName, familyName } = this.state.actor;

    this.setState({
      hasName: Boolean(name),
      hasGivenName: Boolean(givenName),
      hasFamilyName: Boolean(familyName),
    });

    if (namespace === 'people') {
      return Boolean(givenName) && Boolean(familyName);
    }

    return Boolean(name);
  }

  saveActor() {
    const { namespace } = this.props;
    const { actor } = this.state;
    this.props.editActor(actor, namespace);
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
    } = this.props;

    const {
      hasGivenName,
      hasFamilyName,
      hasGender,
      hasName,
      actor,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor &&
          <ActorSettingCard
            namespace={namespace}
            actor={actor}
          >
            <ActorInfoForm
              namespace={namespace}
              hasGivenName={hasGivenName}
              hasFamilyName={hasFamilyName}
              hasGender={hasGender}
              hasName={hasName}
              name={actor.name}
              givenName={actor.givenName}
              familyName={actor.familyName}
              body={actor.body}
              gender={actor.gender}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
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
  viewer: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool,
};

ActorSettingsInfoPage.defaultProps = {
  actor: null,
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
)(ActorSettingsInfoPage));
