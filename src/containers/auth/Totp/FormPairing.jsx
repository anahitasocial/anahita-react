/* eslint-disable no-undef */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Totp as TOTP } from '../../../constants';
import i18n from '../../../languages';

const useStyles = makeStyles((theme) => {
  return {
    qrCode: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(),
      textAlign: 'center',
      backgroundColor: 'white',
    },
    textBlock: {
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(),
    },
  };
});

const TOTPFormPairing = ({
  fields: {
    passcode,
  },
  handleOnChange,
  isFetching = false,
  success = false,
  qrCodeImage = null,
}) => {
  const classes = useStyles();
  const blob = new Blob([qrCodeImage], { type: 'image/png' });
  const src = URL.createObjectURL(blob);

  return (
    <>
      <Typography variant="h5" className={classes.textBlock}>
        {i18n.t('auth:totp.pairing.cTitle')}
      </Typography>
      <Typography variant="body2">
        {i18n.t('auth:totp.pairing.cDesc')}
      </Typography>
      <Typography variant="h6" className={classes.textBlock}>
        {i18n.t('auth:totp.qrCode.cTitle')}
      </Typography>
      <Typography variant="body1" className={classes.textBlock}>
        {i18n.t('auth:totp.qrCode.cDesc')}
      </Typography>
      {qrCodeImage !== '' &&
        <Box className={classes.qrCode}>
          <img src={src} alt="" />
        </Box>}
      <Typography variant="h6" className={classes.textBlock}>
        {i18n.t('auth:totp.qrCode.passcode.title')}
      </Typography>
      <TextField
        autoFocus
        type="text"
        name="passcode"
        value={passcode.value}
        onChange={handleOnChange}
        label={i18n.t('auth:totp.qrCode.passcode.label')}
        margin="normal"
        fullWidth
        inputProps={{
          maxLength: TOTP.FIELDS.PASSCODE.MAX_LENGTH,
          minLength: TOTP.FIELDS.PASSCODE.MIN_LENGTH,
        }}
        required
        disabled={success || isFetching}
        error={passcode.error !== ''}
        helperText={passcode.error}
      />
    </>
  );
};

TOTPFormPairing.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  isFetching: PropTypes.bool,
  success: PropTypes.bool,
  qrCodeImage: PropTypes.object,
};

export default TOTPFormPairing;
