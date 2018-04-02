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

class ActorSettingsInfoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasName: true,
      hasBody: true,
      actor: props.actor,
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
    actor[name] = value;
    this.setState({
      actor,
      [`has${name.toUpperCase()}`]: Boolean(value),
    });
  }

  validate() {
    const { name } = this.state.actor;
    this.setState({
      hasName: Boolean(name),
    });
    return Boolean(name);
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
    } = this.props;

    const {
      hasName,
      hasBody,
      actor,
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
              hasName={hasName}
              hasBody={hasBody}
              name={actor.name}
              body={actor.body}
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
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool,
};

ActorSettingsInfoPage.defaultProps = {
  actor: {},
  success: false,
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    error,
  } = state.actorReducer;

  return {
    actor,
    error,
    success,
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
