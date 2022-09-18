import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';

import LocationIcon from '@material-ui/icons/LocationOn';

import LocationMenu from './Menu';
import LocationForm from '../../components/location/Form';
import actions from '../../actions';
import form from '../../utils/form';
import i18n from '../../languages';
import utils from '../../utils';
import permissions from '../../permissions';

import LocationsType from '../../proptypes/Locations';

import PersonType from '../../proptypes/Person';
import AnahitaMap from '../../components/Map';
import Taggables from '../taggables';
import Progress from '../../components/Progress';
import HeaderMeta from '../../components/HeaderMeta';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const useStyles = makeStyles({
  mapContainer: {
    height: 320,
    width: '100%',
  },
});

const { getAddress } = utils.node;
const fieldNames = ['name', 'address'];

if (!process.env.REACT_APP_LOCATION_FIXED_CITY) {
  fieldNames.push('city');
}

if (!process.env.REACT_APP_LOCATION_FIXED_STATE_PROVINCE) {
  fieldNames.push('state_province');
}

if (!process.env.REACT_APP_LOCATION_FIXED_COUNTRY) {
  fieldNames.push('country');
}

const formFields = form.createFormFields(fieldNames);

const LocationsRead = (props) => {
  const classes = useStyles();
  const {
    readItem,
    editItem,
    setAppTitle,
    alertSuccess,
    alertError,
    items: {
      current: location,
    },
    taggablesCount,
    isFetching,
    error,
    success,
    viewer,
    match: {
      params: {
        id,
      },
    },
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(formFields);

  useEffect(() => {
    readItem(id);
    setAppTitle(i18n.t('locations:cTitle'));
  }, [readItem, id, setAppTitle]);

  useEffect(() => {
    if (error) {
      alertError('Something went wrong!');
    }

    if (success) {
      alertSuccess('Updated successfully.');
    }
  }, [error, alertError, success, alertSuccess]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    location[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);

      formData.city = process.env.REACT_APP_LOCATION_FIXED_CITY || formData.city;

      formData.state_province =
      process.env.REACT_APP_LOCATION_FIXED_STATE_PROVINCE ||
      formData.state_province;

      formData.country = process.env.REACT_APP_LOCATION_FIXED_COUNTRY || formData.country;

      editItem({
        id: location.id,
        ...formData,
      });
    }

    setFields({ ...newFields });
  };

  if (!location.id && isFetching) {
    return (
      <Progress key="location-progress" />
    );
  }

  if (error !== '') {
    return (
      <Redirect push to="/404/" />
    );
  }

  const canAdminister = permissions.node.canAdminister(viewer);

  return (
    <>
      <HeaderMeta
        title={location.name}
      />
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
          action={canAdminister &&
            <LocationMenu
              location={location}
              viewer={viewer}
              handleEdit={handleEdit}
            />}
        />
        {isEditing &&
          <LocationForm
            fields={fields}
            location={location}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
            isFetching={isFetching}
            actions={[
              <Button
                onClick={handleCancel}
                fullWidth
                key="location-action-cancel"
              >
                Cancel
              </Button>,
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                key="location-action-update"
              >
                Update
              </Button>,
            ]}
          />}
        {location.id &&
          <AnahitaMap
            locations={[location]}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div className={classes.mapContainer} />}
            mapElement={<div style={{ height: '100%' }} />}
          />}
        <CardContent>
          <Typography variant="caption">
            {getAddress(location)}
          </Typography>
        </CardContent>
      </Card>
      {location.id > 0 &&
        <Taggables tag={location} />}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    locations: items,
    error,
    success,
    isFetching,
  } = state.locations;

  const {
    total,
  } = state.taggables;

  const taggablesCount = total;

  const { viewer } = state.session;

  return {
    items,
    taggablesCount,
    error,
    success,
    isFetching,
    viewer,
  };
};

LocationsRead.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  readItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  items: LocationsType.isRequired,
  match: PropTypes.object.isRequired,
  taggablesCount: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  viewer: PersonType.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readItem: (id) => {
      return dispatch(actions.locations.read(id));
    },
    editItem: (node) => {
      return dispatch(actions.locations.edit(node));
    },
    setAppTitle: (title) => {
      dispatch(actions.app.setAppTitle(title));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withWidth()(LocationsRead));
