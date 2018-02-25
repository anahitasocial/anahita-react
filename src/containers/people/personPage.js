import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import ActorProfile from '../../components/ActorProfile';
import FollowAction from '../actions/FollowAction';
import {
  readPerson,
} from '../../actions/person';

const styles = theme => ({
  root: {
    width: '100%',
  },
});

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
    const {
      viewer,
      person,
      isAuthenticated,
    } = this.props;

    return (isAuthenticated && viewer.id !== person.id);
  }

  renderProfile(person) {
    const cover = person.coverURL.large && person.coverURL.large.url;
    const avatar = person.imageURL.large && person.imageURL.large.url;
    const canFollow = this.canFollow();
    return (
      <ActorProfile
        cover={cover}
        avatar={avatar}
        name={person.name}
        description={person.body}
        alias={person.alias}
        followAction={canFollow && <FollowAction person={person} />}
      />
    );
  }

  render() {
    const {
      classes,
      person,
    } = this.props;

    return (
      <div className={classes.root}>
        {person && person.id &&
          this.renderProfile(person)
        }
      </div>
    );
  }
}

PersonPage.propTypes = {
  classes: PropTypes.object.isRequired,
  readPerson: PropTypes.func.isRequired,
  person: PropTypes.object,
  viewer: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

PersonPage.defaultProps = {
  person: null,
  viewer: null,
  isAuthenticated: false,
};

const mapStateToProps = (state) => {
  const {
    person,
    errorMessage,
    isLeader,
  } = state.personReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    person,
    isLeader,
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
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonPage));
