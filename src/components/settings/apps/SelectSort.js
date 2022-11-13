import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import i18n from '../../../languages';

const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const SettingsAppsSelectSort = (props) => {
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
        <MenuItem value={SORT.NAME}>
          {i18n.t('commons:sortByOptions.name')}
        </MenuItem>
        <MenuItem value={SORT.ORDERING}>
          {i18n.t('commons:sortByOptions.ordering')}
        </MenuItem>
      </Select>
    </FormControl>
  );
};

SettingsAppsSelectSort.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

SettingsAppsSelectSort.defaultProps = {
  name: 'sort',
  value: '',
};

export default SettingsAppsSelectSort;
