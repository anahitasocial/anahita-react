import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { CountryRegionData } from 'react-country-region-selector';

const SelectCountry = ({
  disabled = false,
  required = false,
  ...props
}) => {
  return (
    <Select {...props} disabled={disabled} required={required}>
      {CountryRegionData.map((option) => {
        const key = `country_${option[0]}`;
        return (
          <MenuItem key={key} value={option[1]}>
            {option[0]}
          </MenuItem>
        );
      })}
    </Select>
  );
};

SelectCountry.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default SelectCountry;
