import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import StepUp from '../../auth/StepUp';
import api from '../../../api';
import utils from '../../../utils';
import actions from '../../../actions';
import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';

// Archive.
//
// The hardest thing about this card is the copy, not the code. Archive sits
// next to delete and MUST NOT read as the gentler option — somebody reaching
// for it because it sounds softer has still done something they cannot undo.
// So the permanence is stated first, before what is preserved, and the typed
// confirmation is the same weight as deletion's.
//
// What genuinely differs from deletion is worth being concrete about, because
// it is the reason to choose this: nothing is destroyed, and the posts stay
// readable at their URLs forever.
const ActorsSettingsArchive = (props) => {
  const {
    actor,
    viewer,
    namespace,
    alertSuccess,
    alertError,
    readActor,
  } = props;

  const [confirmation, setConfirmation] = useState('');
  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isPerson = namespace === 'people';
  const isSelf = actor.id === viewer.id;

  const copy = (key, options) => {
    return i18n.t(`${namespace}:settings.archivePrompts.${key}`, options);
  };

  // Trimmed and case-insensitive, matching the delete card. This is a typo
  // guard and a moment to stop, not an authorisation check — the server
  // decides who may archive.
  const typed = confirmation.trim().toLowerCase();
  const expected = (actor.alias || '').trim().toLowerCase();
  const enabled = typed !== '' && typed === expected && !submitting;

  const submit = () => {
    setSubmitting(true);

    return api[namespace][singularize(namespace)].lifecycle.archive(actor)
      .then((response) => {
        // 204 means nothing happened: already archived, or on its way to being
        // deleted. Saying "archived" then would be a lie about a permanent
        // action.
        if (response.status === 204) {
          alertError(copy('errors.nothingToArchive'));
          return response;
        }

        alertSuccess(copy('archived'));
        return readActor(utils.node.readIdentifier(actor, namespace), namespace);
      })
      .catch((err) => {
        const status = err && err.response && err.response.status;
        const body = (err && err.response && err.response.data) || {};

        // Same two meanings of 403 as the delete card: prove yourself, or you
        // may not do this at all. Opening the dialog for the second would
        // loop forever.
        if (status === 403 && body.error === 'step_up_required') {
          setStepUpOpen(true);
          return null;
        }

        if (status === 403) {
          alertError(copy('errors.forbidden'));
          return null;
        }

        if (status === 409) {
          alertError(body.message || copy('errors.lastSuperAdmin'));
          return null;
        }

        alertError(copy('errors.generic'));
        return null;
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <CardContent>
        {/* Permanence first. Everything else is a reason to choose this over
            deleting, and none of it should arrive before the person knows
            there is no way back. */}
        <Typography variant="body2" color="textSecondary" paragraph>
          <strong>{copy('permanent')}</strong>
        </Typography>

        <Typography variant="body2" color="textSecondary" paragraph>
          {copy(isPerson ? 'personDescription' : 'groupDescription')}
        </Typography>

        {isPerson && isSelf &&
          <Typography variant="body2" color="textSecondary" paragraph>
            {copy('selfSignIn')}
          </Typography>}

        <TextField
          name="confirmation"
          label={copy('confirmLabel', { alias: actor.alias })}
          value={confirmation}
          onChange={(event) => {
            return setConfirmation(event.target.value);
          }}
          variant="outlined"
          margin="normal"
          fullWidth
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={submit}
          color="secondary"
          variant="contained"
          disabled={!enabled}
          fullWidth
        >
          {copy('action')}
        </Button>
      </CardActions>
      <StepUp
        open={stepUpOpen}
        onVerified={() => {
          setStepUpOpen(false);
          submit();
        }}
        onCancel={() => {
          return setStepUpOpen(false);
        }}
      />
    </>
  );
};

ActorsSettingsArchive.propTypes = {
  actor: ActorType.isRequired,
  viewer: PropTypes.objectOf(PropTypes.any).isRequired,
  namespace: PropTypes.string.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  readActor: PropTypes.func.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const { [namespace]: { current: actor } } = state[namespace];
    const { viewer } = state.session;
    return { actor, viewer, namespace };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      readActor: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      alertSuccess: (message) => {
        return dispatch(actions.app.alert.success(message));
      },
      alertError: (message) => {
        return dispatch(actions.app.alert.error(message));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsSettingsArchive);
};
