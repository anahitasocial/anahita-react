/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import i18n from '../../../languages';
import { Password as PASSWORD } from '../../../constants';

const { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } = PASSWORD;

const PasswordEdit = ({
  fields,
  errors,
  submitting,
  showNewPassword,
  onChange,
  onSubmit,
  onToggleVisibility,
}) => {
  return (
    <Card>
      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {i18n.t('password:title')}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {i18n.t('password:description', { count: PASSWORD_MIN_LENGTH })}
          </Typography>

          <TextField
            type="password"
            name="currentPassword"
            label={i18n.t('password:fields.current')}
            value={fields.currentPassword.value}
            onChange={onChange}
            error={Boolean(errors.currentPassword)}
            helperText={errors.currentPassword || ''}
            fullWidth
            margin="normal"
            variant="outlined"
            autoComplete="current-password"
            inputProps={{
              'aria-label': i18n.t('password:fields.current'),
            }}
            disabled={submitting}
            required
          />

          <TextField
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            label={i18n.t('password:fields.new')}
            value={fields.newPassword.value}
            onChange={onChange}
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword || ''}
            fullWidth
            margin="normal"
            variant="outlined"
            autoComplete="new-password"
            inputProps={{
              minLength: PASSWORD_MIN_LENGTH,
              maxLength: PASSWORD_MAX_LENGTH,
              'aria-label': i18n.t('password:fields.new'),
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showNewPassword
                        ? i18n.t('password:toggle.hide')
                        : i18n.t('password:toggle.show')
                    }
                    aria-pressed={showNewPassword}
                    onClick={onToggleVisibility}
                    edge="end"
                    disabled={submitting}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={submitting}
            required
          />
        </CardContent>

        <CardActions>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            fullWidth
          >
            {submitting ? i18n.t('password:submitting') : i18n.t('password:submit')}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

PasswordEdit.propTypes = {
  fields: PropTypes.shape({
    currentPassword: PropTypes.shape({ value: PropTypes.string }).isRequired,
    newPassword: PropTypes.shape({ value: PropTypes.string }).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    currentPassword: PropTypes.string,
    newPassword: PropTypes.string,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
  showNewPassword: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
};

export default PasswordEdit;
