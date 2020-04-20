import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import LocationIcon from '@material-ui/icons/LocationOn';

import * as actions from '../../actions';
import i18n from '../../languages';
import utils from './utils';

import LocationsType from '../../proptypes/Locations';
import LocationDefault from '../../proptypes/LocationDefault';

import AnahitaMap from '../../components/Map';
import Taggables from '../taggables';
import Progress from '../../components/Progress';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const useStyles = makeStyles({
  mapContainer: {
    height: 320,
    width: '100%',
  },
});

const LocationsRead = (props) => {
  const classes = useStyles();
  const {
    readLocation,
    setAppTitle,
    locations: {
      current: location = { ...LocationDefault },
    },
    taggablesCount,
    isFetching,
    error,
    match: {
      params: {
        id,
      },
    },
  } = props;

  useEffect(() => {
    readLocation(id);
    setAppTitle(i18n.t('locations:cTitle'));
  }, []);

  if (isFetching) {
    return (
      <Progress key="location-progress" />
    );
  }

  if (error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

  return (
    <React.Fragment>
      <Card square>
        <CardHeader
          avatar={
            <Avatar>
              <LocationIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {location.name}
            </Typography>
          }
          subheader={i18n.t('taggables:count', {
            count: taggablesCount,
          })}
        />
        <Divider light />
        <AnahitaMap
          locations={[location]}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div className={classes.mapContainer} />}
          mapElement={<div style={{ height: '100%' }} />}
        />
        <Divider light />
        <CardContent>
          <Typography variant="caption">
            {utils.getAddress(location)}
          </Typography>
        </CardContent>
      </Card>
      <Divider light />
      <Taggables tag={location} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    locations,
    error,
    isFetching,
  } = state.locations;

  const {
    total,
  } = state.taggables;

  const taggablesCount = total;

  return {
    locations,
    taggablesCount,
    error,
    isFetching,
  };
};

LocationsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readLocation: PropTypes.func.isRequired,
  locations: LocationsType.isRequired,
  match: PropTypes.object.isRequired,
  taggablesCount: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readLocation: (id) => {
      return dispatch(actions.locations.read(id));
    },
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(LocationsRead));
