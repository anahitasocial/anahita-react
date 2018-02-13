import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
// import Typography from 'material-ui/Typography';
import ActorProfile from '../../components/ActorProfile';

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

const PersonWrapper = (props) => {
  const {
    person,
    canFollow,
    handleUnfollowPerson,
    handleFollowPerson,
  } = props;

  const coverSrc = person.coverURL.large && person.coverURL.large.url;
  const avatarSrc = person.imageURL.large && person.imageURL.large.url;

  return (
    <ActorProfile
      cover={coverSrc}
      avatar={avatarSrc}
      name={person.name}
      description={person.body}
      alias={person.alias}
      canFollow={canFollow}
      handleFollowActor={handleFollowPerson}
      handleUnfollowActor={handleUnfollowPerson}
    />
  );
};

PersonWrapper.propTypes = {
  handleUnfollowPerson: PropTypes.func.isRequired,
  handleFollowPerson: PropTypes.func.isRequired,
  canFollow: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
};

class PersonPage extends React.Component {
  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.readPerson(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.readPerson(nextProps.match.params.id);
    }
  }

  canFollow() {
    const { viewer, person } = this.props;
    return viewer.id !== person.id;
  }

  handleFollowPerson() {
    const { viewer, person } = this.props;
    this.props.followPerson(viewer, person);
  }

  handleUnfollowPerson() {
    const { viewer, person } = this.props;
    this.props.unfollowPerson(viewer, person);
  }

  render() {
    const {
      person,
      isAuthenticated,
    } = this.props;

    return (
      <div>
        {person.id &&
          <PersonWrapper
            person={person}
            canFollow={this.canFollow}
            handleFollowPerson={this.handleFollowPerson}
            handleUnfollowPerson={this.handleUnfollowPerson}
            isAuthenticated={isAuthenticated}
          />
        }
      </div>
    );
  }
}

PersonPage.propTypes = {
  readPerson: PropTypes.func.isRequired,
  followPerson: PropTypes.func.isRequired,
  unfollowPerson: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
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
