import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Totp as TOTP } from '../../../constants';
import i18n from '../../../languages';

const TOTPFormPassword = ({
  fields: {
    password,
  },
  handleOnChange,
  isFetching = false,
  success = false,
}) => {
  return (
    <>
      <Typography variant="h5" color="primary">
        {i18n.t('auth:totp.password.title')}
      </Typography>
      <TextField
        type="password"
        name="password"
        value={password.value}
        onChange={handleOnChange}
        label={i18n.t('auth:totp.password.label')}
        margin="normal"
        fullWidth
        inputProps={{
          maxLength: TOTP.FIELDS.PASSWORD.MAX_LENGTH,
          minLength: TOTP.FIELDS.PASSWORD.MIN_LENGTH,
        }}
        required
        disabled={success || isFetching}
        error={password.error !== ''}
        helperText={password.error}
        autoComplete="off"
      />
    </>
  );
};

TOTPFormPassword.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
};

export default TOTPFormPassword;
