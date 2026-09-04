import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ActorType from '../../../proptypes/Actor';
import { Actor as ACTOR } from '../../../constants';
import i18n from '../../../languages';

const { ALIAS } = ACTOR.FIELDS;

// Days a deleted profile can be restored before it is erased. Mirrors
// constants.AccountGraceDays in auth-service and GraceDays in the sweeper — if
// that number moves, this text stops being true.
const GRACE_DAYS = 30;

// Delete form.
//
// It used to be a text field and a red button, with no statement of what
// deletion destroys, whether it is reversible, or when it takes effect. A
// thirty-day grace period now exists and the only place it appeared was the
// confirmation email — which is the backstop, not the interface.
const ActorDeleteForm = (props) => {
  const {
    handleOnChange,
    handleOnSubmit,
    handleOnRestore,
    fields: {
      alias,
    },
    actor,
    namespace,
    isFetching,
  } = props;

  // Namespace-specific, because the two differ in what is true. A person is
  // told to sign in to restore and that their passkeys go; neither applies to a
  // group, which cannot sign in and has none — and it was being told both.
  const copy = (key, options) => {
    return i18n.t(`${namespace}:settings.deletePrompts.${key}`, options);
  };

  // Already scheduled. The form would offer to delete something that is
  // already on its way out; what is wanted here is the way back.
  //
  // GROUPS ONLY, and the namespace check is load-bearing rather than tidiness.
  // People restore themselves by signing in, so there is no person restore
  // endpoint and no person restore copy — without this guard an administrator
  // opening a deleted person's settings got a button labelled with the raw
  // i18n key that would have 404ed if pressed.
  const canRestore = namespace === 'groups';

  if (actor.deletedAt && canRestore) {
    const purgeDate = new Date(actor.deletedAt);
    purgeDate.setDate(purgeDate.getDate() + GRACE_DAYS);

    return (
      <>
        <CardContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            {copy('scheduled', {
              date: purgeDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            })}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {copy('reversible', { count: GRACE_DAYS })}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={handleOnRestore}
            color="primary"
            variant="contained"
            disabled={isFetching}
            fullWidth
          >
            {copy('restore')}
          </Button>
        </CardActions>
      </>
    );
  }

  // Scheduled, but this namespace has no restore route. Say so plainly rather
  // than offering a delete form for something already being deleted.
  if (actor.deletedAt) {
    return (
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {copy('scheduled', {
            date: (() => {
              const purge = new Date(actor.deletedAt);
              purge.setDate(purge.getDate() + GRACE_DAYS);
              return purge.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            })(),
          })}
        </Typography>
      </CardContent>
    );
  }

  // Trimmed and case-insensitive.
  //
  // A strict comparison meant a trailing space — trivially picked up copying
  // the alias off the page — left the button disabled with no error and nothing
  // to explain it. This is a typo guard, not an authorisation check: the server
  // decides who may delete, and matching case exactly proves nothing.
  const typed = alias.value.trim().toLowerCase();
  const expected = (actor.alias || '').trim().toLowerCase();
  const enableDelete = typed !== '' && typed === expected;

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <CardContent>
        {/* What is lost, before the field that lets you lose it. */}
        <Typography variant="body2" color="textSecondary" paragraph>
          {copy('description')}
        </Typography>

        {/* And what is not. Naming the grace period is the point of this card
            existing at all — without it the recovery path we built is
            invisible to the only person who needs it. */}
        <Typography variant="body2" color="textSecondary" paragraph>
          {copy('reversible', { count: GRACE_DAYS })}
        </Typography>

        <Typography variant="body2" color="textSecondary" paragraph>
          {copy('revoked')}
        </Typography>

        <Typography variant="body2" color="textSecondary" paragraph>
          {copy('handle', { alias: actor.alias })}
        </Typography>
      </CardContent>

      <Divider />

      <CardContent>
        <TextField
          name="alias"
          onChange={handleOnChange}
          label={i18n.t('actor:alias')}
          error={alias.error !== ''}
          helperText={alias.error}
          margin="normal"
          fullWidth
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
          inputProps={{
            maxLength: ALIAS.MAX_LENGTH,
            minLength: ALIAS.MIN_LENGTH,
          }}
          required
        />
        <FormHelperText>
          {i18n.t('actor:delete.prompts.challenge', {
            alias: actor.alias,
          })}
        </FormHelperText>
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isFetching || !enableDelete}
          fullWidth
        >
          {isFetching ? i18n.t('actor:delete.prompts.inProgress') : i18n.t('actions:delete')}
        </Button>
      </CardActions>
    </form>
  );
};

ActorDeleteForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleOnSubmit: PropTypes.func.isRequired,
  handleOnRestore: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.any).isRequired,
  actor: ActorType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default ActorDeleteForm;
