import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card, {
  CardHeader,
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import ActorInfoForm from '../../components/ActorInfoForm';
import { addActor } from '../../actions/actor';

const styles = {
  root: {
    width: '100%',
  },
};

class ActorAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: {},
      hasName: true,
      hasBody: true,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    const { name, body } = this.state.actor;
    this.setState({
      hasName: Boolean(name),
      hasBody: Boolean(body),
    });
    return Boolean(name) && Boolean(body);
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
      error,
      isFetching,
    } = this.props;

    const {
      hasName,
      hasBody,
      actor,
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
                {actor.name && actor.name.charAt(0).toUpperCase()}
              </Avatar>
            }
          />
          <ActorInfoForm
            hasName={hasName}
            hasBody={hasBody}
            error={error}
            formTitle={`Add new ${singularize(namespace)}`}
            name={actor.name}
            body={actor.body}
            handleFieldChange={this.handleFieldChange}
            handleFormSubmit={this.handleFormSubmit}
            isFetching={isFetching}
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
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

ActorAddPage.defaultProps = {
  actor: {},
  error: '',
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    error,
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
    addActor: (actor, namespace) => {
      dispatch(addActor(actor, namespace));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorAddPage));
