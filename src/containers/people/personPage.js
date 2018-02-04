import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import {
  readPerson,
  followPerson,
  unfollowPerson,
} from '../../actions/person';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
});

class PersonPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      person: props.person,
      isModified: false
    };
  }

  componentWillMount() {
      const { id } = this.props.match.params;
      this.props.readPerson(id);
  }

  canFollow() {
    const { viewer, person } = this.props;
    return viewer.id !== person.id;
  }

  handleFollowPerson = () => {
    const { viewer, person } = this.props;
    this.props.followPerson(viewer, person);
  }

  handleUnfollowPerson = () => {
    const { viewer, person } = this.props;
    this.props.unfollowPerson(viewer, person);
  }

  render() {
    const {
      viewer,
      person
    } = this.props;
    return(
      <div>
        <p>{`You are ${viewer.name}`}</p>
        <p>{`This is ${person.name}`}</p>
      </div>
    );
  }
}

PersonPage.propTypes = {
  classes: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const {
    person,
    errorMessage,
  } = state.personReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    person,
    errorMessage,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPerson: (id) => {
      dispatch(readPerson(id));
    },
    followPerson: (viewer, person) => {
      dispatch(followPerson(viewer, person));
    },
    unfollowPerson: (viewer, person) => {
      dispatch(unfollowPerson(viewer, person));
    },
  };
}

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonPage));
