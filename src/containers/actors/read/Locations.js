import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import * as actions from '../../../actions';
import ActorType from '../../../proptypes/Actor';

import ActorBodyLocations from '../../../components/actor/body/Locations';
import Progress from '../../../components/Progress';

class ActorsReadLocations extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      locations: {
        byId: {},
        allIds: [],
      },
      isFetching: false,
      error: '',
    };

    this.fetchList();
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      locations,
      error,
      isFetching,
    } = nextProps;

    return {
      locations,
      error,
      isFetching,
    };
  }

  componentWillUnmount() {
    const { resetLocations } = this.props;
    resetLocations();
  }

  fetchList() {
    const { browseLocations, actor } = this.props;

    browseLocations({
      locatable_id: actor.id,
    });
  }

  render() {
    const {
      locations,
      isFetching,
      error,
    } = this.state;

    if (isFetching) {
      return (
        <Progress />
      );
    }

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    return (
      <ActorBodyLocations locations={locations} />
    );
  }
}

ActorsReadLocations.propTypes = {
  actor: ActorType.isRequired,
  browseLocations: PropTypes.func.isRequired,
  resetLocations: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    locations,
    error,
    isFetching,
  } = state.locations;

  return {
    locations,
    error,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseLocations: (params) => {
      return dispatch(actions.locations.browse(params));
    },
    resetLocations: () => {
      return dispatch(actions.locations.reset());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsReadLocations);
