import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
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
    if (!nextProps.actor.id) {
      this.setState({
        actor: {},
      });
    }
  }

  handleFieldChange(event) {
    const { value } = event.target;
    this.setState({
      alias: value,
      hasAlias: value === this.state.actor.alias,
    });
  }

  validate() {
    const { alias, actor } = this.state;
    const hasAlias = alias === actor.alias;
    this.setState({ alias, hasAlias });
    return hasAlias;
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
      success,
      isFetching,
      error,
    } = this.props;

    const {
      hasAlias,
      actor,
    } = this.state;

    const isDeleted = !actor.id && success;

    return (
      <div className={classes.root}>
        {isDeleted &&
          <Typography
            variant="body1"
            color="primary"
            paragraph
          >
              {'Deleted successfully!'}
          </Typography>
        }
        {actor.id &&
          <ActorSettingCard
            namespace={namespace}
            actor={actor}
          >
            <ActorDeleteForm
              hasAlias={hasAlias}
              alias={actor.alias}
              isFetching={isFetching}
              error={error}
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

ActorSettingsDeletePage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  deleteActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
  namespace: PropTypes.string.isRequired,
  error: PropTypes.string,
  success: PropTypes.bool,
  isFetching: PropTypes.bool,
};

ActorSettingsDeletePage.defaultProps = {
  actor: {},
  success: false,
  isFetching: false,
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actor,
    error,
    success,
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
    deleteActor: (actor) => {
      dispatch(deleteActor(actor));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsDeletePage));
