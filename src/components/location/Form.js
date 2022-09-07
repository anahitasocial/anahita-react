import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import { Locations as LOCATION } from '../../constants';
import LocationType from '../../proptypes/Location';
import CountrySelect from '../select/Country';
import RegionSelect from '../select/Region';

const {
  TITLE,
  ADDRESS,
  CITY,
} = LOCATION.FIELDS;

const LocationForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields,
    location,
    isFetching,
    actions,
    requiredFields,
  } = props;

  return (
    <form
      onSubmit={handleOnSubmit}
      noValidate
      autoComplete="off"
    >
      <CardContent>
        <TextField
          id="location-name"
          margin="normal"
          variant="outlined"
          label="Name"
          onChange={handleOnChange}
          name="name"
          value={location.name}
          error={fields.name.error !== ''}
          helperText={fields.name.error}
          inputProps={{
            maxLength: TITLE.MAX_LENGTH,
          }}
          disabled={isFetching}
          fullWidth
          autoFocus
          required={requiredFields.includes('name')}
        />
        <TextField
          id="location-address"
          margin="normal"
          variant="outlined"
          label="Address"
          onChange={handleOnChange}
          name="address"
          value={location.address}
          error={fields.address.error !== ''}
          helperText={fields.address.error}
          inputProps={{
            maxLength: ADDRESS.MAX_LENGTH,
          }}
          disabled={isFetching}
          fullWidth
          required={requiredFields.includes('address')}
        />
        {fields.city &&
          <TextField
            id="location-city"
            margin="normal"
            variant="outlined"
            label="City"
            onChange={handleOnChange}
            name="city"
            value={location.city}
            error={fields.city.error !== ''}
            helperText={fields.city.error}
            inputProps={{
              maxLength: CITY.MAX_LENGTH,
            }}
            disabled={isFetching}
            fullWidth
            required={requiredFields.includes('city')}
          />}
        {fields.state_province &&
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
          >
            <InputLabel id="location-country-label">
              Province
            </InputLabel>
            <RegionSelect
              id="state_province"
              name="state_province"
              label="Province"
              onChange={handleOnChange}
              value={location.state_province}
              disabled={location.country === '' || isFetching}
              country={location.country}
            />
          </FormControl>}
        {fields.country &&
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
          >
            <InputLabel id="location-country-label">
              Country
            </InputLabel>
            <CountrySelect
              id="location-country"
              name="country"
              label="Country"
              onChange={handleOnChange}
              value={location.country}
              disabled={isFetching}
            />
          </FormControl>}
      </CardContent>
      {actions &&
      <CardActions>
        {actions}
      </CardActions>}
    </form>
  );
};

LocationForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  location: LocationType.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actions: PropTypes.node,
  isFetching: PropTypes.bool.isRequired,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
};

LocationForm.defaultProps = {
  actions: null,
  requiredFields: [
    'name',
    'address',
    'city',
    'state_province',
    'country',
  ],
};

export default LocationForm;
