import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const TYPE = {
  ALL: '-',
  AUTHENTICATION: 'authentication',
  CONNECT: 'connect',
  PROFILE: 'Profile',
  STORAGE: 'storage',
  SYSTEM: 'system',
  USER: 'user',
};

const SettingsPluginsSelectType = (props) => {
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
        <MenuItem value={TYPE.ALL}>Show all</MenuItem>
        <MenuItem value={TYPE.AUTHENTICATION}>Authentication</MenuItem>
        <MenuItem value={TYPE.CONNECT}>Connect</MenuItem>
        <MenuItem value={TYPE.PROFILE}>Profile</MenuItem>
        <MenuItem value={TYPE.STORAGE}>Storage</MenuItem>
        <MenuItem value={TYPE.SYSTEM}>System</MenuItem>
        <MenuItem value={TYPE.USER}>User</MenuItem>
      </Select>
    </FormControl>
  );
};

SettingsPluginsSelectType.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

SettingsPluginsSelectType.defaultProps = {
  name: 'type',
  value: TYPE.ALL,
};

export default SettingsPluginsSelectType;
