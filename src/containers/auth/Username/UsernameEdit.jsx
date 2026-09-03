import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

import i18n from '../../../languages';
import { Username as USERNAME } from '../../../constants';

// Change-username card.
//
// Collapsed by default, matching the email and password cards it sits
// beside: a settings page is read far more often than it is edited, and
// a form sitting permanently open invites accidental edits to a field
// that is also this person's public address.
const UsernameEdit = ({
  currentUsername,
  isEditing,
  fields,
  errors,
  submitting,
  onOpen,
  onCancel,
  onChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader title={i18n.t('username:title')} />
      <Divider />

      {/* Shown in both states. Collapsed it answers "what is my
          handle"; expanded it is what the person checks the new one
          against. */}
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AlternateEmailIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={i18n.t('username:fields.current')}
            secondary={currentUsername}
          />
        </ListItem>
      </List>

      {!isEditing &&
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            {i18n.t('username:description')}
          </Typography>
        </CardContent>}

      {!isEditing &&
        <CardActions>
          <Button
            onClick={onOpen}
            color="primary"
            variant="outlined"
            fullWidth
          >
            {i18n.t('username:change')}
          </Button>
        </CardActions>}

      {isEditing &&
        <>
          <Divider />
          <form onSubmit={onSubmit} noValidate>
            <CardContent>
              {/* Kept as body copy rather than folded into the header:
                  it carries the consequence — the old handle is
                  released and old profile links break — which the
                  person needs while deciding, not just while browsing. */}
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {i18n.t('username:description')}
              </Typography>

              <TextField
                name="username"
                label={i18n.t('username:fields.new')}
                value={fields.username.value}
                onChange={onChange}
                error={Boolean(errors.username)}
                helperText={errors.username || i18n.t('username:helper')}
                fullWidth
                margin="normal"
                variant="outlined"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                autoFocus
                inputProps={{
                  minLength: USERNAME.USERNAME_MIN_LENGTH,
                  maxLength: USERNAME.USERNAME_MAX_LENGTH,
                  'aria-label': i18n.t('username:fields.new'),
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
                {submitting ? i18n.t('username:submitting') : i18n.t('username:submit')}
              </Button>
            </CardActions>
          </form>
        </>}
    </Card>
  );
};

UsernameEdit.propTypes = {
  currentUsername: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  fields: PropTypes.shape({
    username: PropTypes.shape({ value: PropTypes.string }).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UsernameEdit;
