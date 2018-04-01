import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Redirect } from 'react-router-dom';
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
      hasAlias: true,
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
    if (!nextProps.actor) {
      this.setState({
        actor: {},
      });
    }
  }

  handleFieldChange(event) {
    const { value } = event.target;
    this.setState({
      alias: value,
      hasAlias: Boolean(value),
    });
  }

  validate() {
    const { alias, actor } = this.state;
    return alias === actor.alias;
  }

  deleteActor() {
    const { actor } = this.state;
    this.props.deleteActor(actor);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.deleteActor();
    }
  }

  render() {
    const {
      classes,
      namespace,
    } = this.props;

    const {
      hasAlias,
      actor,
    } = this.state;

    return (
      <div className={classes.root}>
        {actor.id &&
          <ActorSettingCard
            namespace={namespace}
            actor={actor}
          >
            <ActorDeleteForm
              hasAlias={hasAlias}
              alias={actor.alias}
              handleFieldChange={this.handleFieldChange}
              handleFormSubmit={this.handleFormSubmit}
              dismissPath={`/${namespace}/${actor.id}/settings/`}
            />
          </ActorSettingCard>
        }
        {!actor.id &&
          <Redirect to={`/${namespace}/`} />
        }
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
};

ActorSettingsDeletePage.defaultProps = {
  actor: {},
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
  } = state.actorReducer;

  return {
    actor,
    error,
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
