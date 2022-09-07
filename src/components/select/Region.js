import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { CountryRegionData } from 'react-country-region-selector';
import _ from 'lodash';

const getRegions = (country) => {
  const index = _.findIndex(CountryRegionData, (item) => {
    return item[1] === country;
  });

  if (index === -1) {
    return [];
  }

  return CountryRegionData[index][2].split('|').map((item) => {
    return item.split('~');
  });
};

const SelectRegion = (props) => {
  const { country } = props;
  const regions = getRegions(country);
  return (
    <Select {...props}>
      {regions.map((region) => {
        const key = `region_${region[1]}`;
        return (
          <MenuItem key={key} value={region[1]}>
            {region[0]}
          </MenuItem>
        );
      })}
    </Select>
  );
};

SelectRegion.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

SelectRegion.defaultProps = {
  disabled: false,
  required: false,
};

export default SelectRegion;
