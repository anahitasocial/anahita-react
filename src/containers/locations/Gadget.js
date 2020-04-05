import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import * as actions from '../../actions';
import LocationsType from '../../proptypes/Locations';
import NodeType from '../../proptypes/Node';

import Gadget from '../../components/locations/Gadget';
import Progress from '../../components/Progress';

const LocationsGadget = (props) => {
  const {
    node,
    locations,
    isFetching,
    error,
    browseLocations,
    resetLocations,
  } = props;

  useEffect(() => {
    browseLocations({
      locatable_id: node.id,
    });

    return () => {
      resetLocations();
    };
  }, []);

  const handleDelete = (event, id) => {
    console.log(id);
  };

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
    <Gadget
      locations={locations}
      handleDelete={handleDelete}
    />
  );
};

LocationsGadget.propTypes = {
  node: NodeType.isRequired,
  locations: LocationsType.isRequired,
  browseLocations: PropTypes.func.isRequired,
  resetLocations: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
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
)(LocationsGadget);
