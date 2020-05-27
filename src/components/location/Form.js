import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import i18n from '../../languages';
import { Locations as LOCATION } from '../../constants';

const {
  TITLE,
  ADDRESS,
  CITY,
  STATE_PROVINCE,
  COUNTRY,
} = LOCATION.FIELDS;

const LocationForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    handleCancel,
    fields: {
      name,
      address,
      city,
      state_province,
      country,
    },
    isFetching,
  } = props;

  const enableSubmit = name.isValid &&
  address.isValid &&
  city.isValid &&
  state_province.isValid &&
  country.isValid;

  return (
    <form onSubmit={handleOnSubmit}>
      <Card>
        <CardContent>
          <TextField
            id="location-name"
            margin="normal"
            variant="outlined"
            label="Name"
            onChange={handleOnChange}
            name="name"
            value={name.value}
            error={name.error !== ''}
            helperText={name.error}
            inputProps={{
              maxLength: TITLE.MAX_LENGTH,
            }}
            disabled={isFetching}
            fullWidth
            autoFocus
            required
          />
          <TextField
            id="location-address"
            margin="normal"
            variant="outlined"
            label="Address"
            onChange={handleOnChange}
            name="address"
            value={address.value}
            error={address.error !== ''}
            helperText={address.error}
            inputProps={{
              maxLength: ADDRESS.MAX_LENGTH,
            }}
            disabled={isFetching}
            fullWidth
            required
          />
          <TextField
            id="location-city"
            margin="normal"
            variant="outlined"
            label="City"
            onChange={handleOnChange}
            name="city"
            value={city.value}
            error={city.error !== ''}
            helperText={city.error}
            inputProps={{
              maxLength: CITY.MAX_LENGTH,
            }}
            disabled={isFetching}
            fullWidth
            required
          />
          <TextField
            id="location-state-province"
            margin="normal"
            variant="outlined"
            label="State/Province"
            onChange={handleOnChange}
            name="state_province"
            value={state_province.value}
            error={state_province.error !== ''}
            helperText={state_province.error}
            inputProps={{
              maxLength: STATE_PROVINCE.MAX_LENGTH,
            }}
            disabled={isFetching}
            fullWidth
            required
          />
          <TextField
            id="location-country"
            margin="normal"
            variant="outlined"
            label="Country"
            onChange={handleOnChange}
            name="country"
            value={country.value}
            error={country.error !== ''}
            helperText={country.error}
            inputProps={{
              maxLength: COUNTRY.MAX_LENGTH,
              minLength: COUNTRY.MIN_LENGTH,
            }}
            disabled={isFetching}
            fullWidth
            required
          />
        </CardContent>
        <CardActions>
          {handleCancel &&
            <Button
              onClick={handleCancel}
              size="small"
              fullWidth
            >
              {i18n.t('actions:cancel')}
            </Button>
          }
          <Button
            type="submit"
            color="primary"
            disabled={isFetching || !enableSubmit}
            variant="contained"
            size="small"
            fullWidth
          >
            {i18n.t('actions:add')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

LocationForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

LocationForm.defaultProps = {
  handleCancel: null,
};

export default LocationForm;
