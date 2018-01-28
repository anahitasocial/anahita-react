import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
// import Button from 'material-ui/Button';
// import Toolbar from 'material-ui/Toolbar';

import { browsePeople } from '../../actions/people';

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
      keywordFilter: '*',
      usertypeFiter: '*',
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
        <Typography type="title" color="inherit" className={classes.flex}>
            People
        </Typography>
        {people.map((person) => {
          const key = `person_${person.id}`;
          return (
            <p key={key}>{person.name}</p>
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
};

PeoplePage.defaultProps = {
  people: [],
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
    viewer
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
    browsePeople: (params) => dispatch(browsePeople(params)),
  };
}

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PeoplePage));
