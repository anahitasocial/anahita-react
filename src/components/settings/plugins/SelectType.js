import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import i18n from '../../../languages';

const TYPE = {
  ALL: '-',
  AUTHENTICATION: 'authentication',
  CONNECT: 'connect',
  PROFILE: 'profile',
  USER: 'user',
  STORAGE: 'storage',
  SYSTEM: 'system',
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
        <MenuItem value={TYPE.ALL}>
          {i18n.t('commons:filterByOptions.all')}
        </MenuItem>
        <MenuItem value={TYPE.AUTHENTICATION}>
          {i18n.t('commons:filterByOptions.authentication')}
        </MenuItem>
        <MenuItem value={TYPE.CONNECT}>
          {i18n.t('commons:filterByOptions.connect')}
        </MenuItem>
        <MenuItem value={TYPE.PROFILE}>
          {i18n.t('commons:filterByOptions.profile')}
        </MenuItem>
        <MenuItem value={TYPE.USER}>
          {i18n.t('commons:filterByOptions.user')}
        </MenuItem>
        <MenuItem value={TYPE.STORAGE}>
          {i18n.t('commons:filterByOptions.storage')}
        </MenuItem>
        <MenuItem value={TYPE.SYSTEM}>
          {i18n.t('commons:filterByOptions.system')}
        </MenuItem>
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
