import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const SORT = {
  ELEMENT: 'element',
  ENABLED: 'enabled',
  NAME: 'name',
  ORDERING: 'ordering',
  TYPE: 'type',
};

const SettingsPluginsSelectSort = (props) => {
  const {
    name,
    value,
    label,
    handleOnChange,
  } = props;

  return (
    <FormControl fullWidth>
      <InputLabel id={`configs-plugins-${name}-label`}>
        {label}
      </InputLabel>
      <Select
        id={`configs-plugins-${name}`}
        labelId={`configs-plugins-${name}-label`}
        name={name}
        value={value}
        onChange={handleOnChange}
        label={label}
      >
        <MenuItem value={SORT.ELEMENT}>Element</MenuItem>
        <MenuItem value={SORT.ENABLED}>Enabled</MenuItem>
        <MenuItem value={SORT.NAME}>Name</MenuItem>
        <MenuItem value={SORT.ORDERING}>Ordering</MenuItem>
        <MenuItem value={SORT.TYPE}>Type</MenuItem>
      </Select>
    </FormControl>
  );
};

SettingsPluginsSelectSort.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

SettingsPluginsSelectSort.defaultProps = {
  name: 'sort',
  value: '',
};

export default SettingsPluginsSelectSort;
