import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Person as PERSON } from '../../constants';
import i18n from '../../languages';

const usertypes = [
  PERSON.FIELDS.TYPE.REGISTERED,
  PERSON.FIELDS.TYPE.ADMIN,
  PERSON.FIELDS.TYPE.SUPER_ADMIN,
];

const SelectPersontype = (props) => {
  return (
    <Select {...props}>
      <MenuItem>
        All
      </MenuItem>
      {usertypes.map((usertype) => {
        const key = `usertype_${usertype}`;
        return (
          <MenuItem key={key} value={usertype}>
            {i18n.t(`people:person.usertypeOptions.${usertype}`)}
          </MenuItem>
        );
      })}
    </Select>
  );
};

SelectPersontype.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

SelectPersontype.defaultProps = {
  disabled: false,
  required: false,
  value: '',
};

export default SelectPersontype;
