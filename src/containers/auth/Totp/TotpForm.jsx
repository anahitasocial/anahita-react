import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import LoginIcon from '@material-ui/icons/Person';

import i18n from '../../../languages';
import { Totp as TOTP } from '../../../constants';

const TotpForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    fields: {
      passcode,
    },
    isFetching,
  } = props;

  const enableSubmit = passcode.isValid;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <LoginIcon />
            </Avatar>
          }
          title={
            <Typography variant="h6">
              {i18n.t('auth:totp.verify.cTitle')}
            </Typography>
          }
        />
        <CardContent>
          <Typography variant="body1">
            {i18n.t('auth:totp.verify.cDesc')}
          </Typography>
          <TextField
            autoFocus
            name="passcode"
            value={passcode.value}
            onChange={handleOnChange}
            label={i18n.t('auth:totp.verify.passcode')}
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: TOTP.FIELDS.PASSCODE.MAX_LENGTH,
              minLength: TOTP.FIELDS.PASSCODE.MIN_LENGTH,
            }}
            error={passcode.error !== ''}
            helperText={passcode.error}
            required
          />
        </CardContent>
        <CardActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isFetching || !enableSubmit}
            fullWidth
          >
            {i18n.t('actions:login')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

TotpForm.propTypes = {
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default TotpForm;
