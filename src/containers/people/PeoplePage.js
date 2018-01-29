import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import { browsePeople } from '../../actions/people';
import ActorCard from '../../components/cards/ActorCard';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
});

class PeoplePage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      keywordFilter: '',
      usertypeFiter: '',
      disabledFilter: false,
    };
  }

  componentWillMount() {
    const {
      keywordFilter,
      usertypeFiter,
      disabledFilter,
    } = this.state;
    const { offset, limit } = this.props;
    this.props.browsePeople({
      keywordFilter,
      usertypeFiter,
      disabledFilter,
      offset,
      limit,
    });
  }

  render() {
    const {
      classes,
      people,
    } = this.props;

    return (
      <div className={classes.root}>
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
              People
          </Typography>
        </Toolbar>
        {people.map((person) => {
          const key = `person_${person.id}`;
          const avatarSrc = person.imageURL.medium && person.imageURL.medium.url;
          const coverSrc = person.coverURL.medium && person.coverURL.medium.url;
          return (
            <ActorCard
              key={key}
              name={person.name}
              alias={person.username}
              description={person.body}
              avatar={avatarSrc}
              cover={coverSrc}
            />
          );
        })
        }
      </div>
    );
  }
}

PeoplePage.propTypes = {
  classes: PropTypes.object.isRequired,
  browsePeople: PropTypes.func.isRequired,
  people: PropTypes.array,
  offset: PropTypes.number,
  limit: PropTypes.number,
};

PeoplePage.defaultProps = {
  people: [],
  offset: 0,
  limit: 60,
};

const mapStateToProps = (state) => {
  const {
    people,
    person,
    deleteSuccess,
    errorMessage,
    offset,
    limit,
    total,
  } = state.peopleReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    people,
    person,
    deleteSuccess,
    errorMessage,
    offset,
    limit,
    total,
    isAuthenticated,
    viewer,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    browsePeople: (params) => {
      dispatch(browsePeople(params));
    },
  };
}

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeoplePage));
