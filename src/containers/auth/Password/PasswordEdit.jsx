/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
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

// Collapsed by default: header plus a single "Update password" button.
// Opening the form is a deliberate act, and Cancel puts it away again.
const PasswordEdit = ({
  isEditing,
  fields,
  errors,
  submitting,
  showNewPassword,
  onOpen,
  onCancel,
  onChange,
  onSubmit,
  onToggleVisibility,
}) => {
  return (
    <Card>
      {/* CardHeader rather than an inline Typography heading, matching
          the Two-Factor Auth, Passkeys, and Authentications cards this
          now sits alongside in the Security tab. */}
      <CardHeader
        title={i18n.t('password:cTitle')}
        subheader={i18n.t('password:cDesc')}
      />
      <Divider />
      {!isEditing &&
        <CardActions>
          <Button
            onClick={onOpen}
            color="primary"
            variant="outlined"
            fullWidth
          >
            {i18n.t('password:submit')}
          </Button>
        </CardActions>}

      {isEditing &&
        <>
          <form onSubmit={onSubmit} noValidate>
            <CardContent>
              {/* Kept as body copy rather than folded into the subheader —
                  it carries the length requirement, which the person needs
                  while typing, not just while deciding whether to open the
                  card. */}
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {i18n.t('password:description', { count: PASSWORD_MIN_LENGTH })}
              </Typography>

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
                onClick={onCancel}
                disabled={submitting}
                fullWidth
              >
                {i18n.t('actions:cancel')}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                fullWidth
              >
                {submitting ? i18n.t('password:submitting') : i18n.t('password:update')}
              </Button>
            </CardActions>
          </form>
        </>}
    </Card>
  );
};

PasswordEdit.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  fields: PropTypes.shape({
    newPassword: PropTypes.shape({ value: PropTypes.string }).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    newPassword: PropTypes.string,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
  showNewPassword: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
};

export default PasswordEdit;
