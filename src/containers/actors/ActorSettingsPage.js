import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import {
  readActor,
} from '../../actions/actor';

const styles = theme => ({
  root: {},
});

class ActorSettingsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.readActor(id, this.props.namespace);
  }

  render() {
    const {
      classes,
      actor
    } = this.props;

    return(
      <div className={classes.root}>
        Actor Settings Page: @{actor.alias}
      </div>
    );
  }
}

ActorSettingsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readActor: PropTypes.func.isRequired,
  actor: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  viewer: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
};

ActorSettingsPage.defaultProps = {
  actor: null,
};

const mapStateToProps = (state) => {
  const {
    actor,
    errorMessage,
  } = state.actorReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    actor,
    errorMessage,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readActor: (id, namespace) => {
      dispatch(readActor(id, namespace));
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorSettingsPage));
