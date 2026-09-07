import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflection';

import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import api from '../../../api';
import actions from '../../../actions';
import i18n from '../../../languages';
import ActorType from '../../../proptypes/Actor';

// Disable, and re-enable.
//
// The reversible one, and the card is deliberately light because of it — no
// typed confirmation, no step-up. Making an administrator type an alias to
// flip a switch they can flip straight back trains them to type aliases
// without reading, which is exactly the habit the two cards below it depend on
// them NOT having.
//
// One button whose label follows the state, rather than a toggle. A toggle in
// a Danger zone invites a stray click; a button that says what it will do does
// not.
const ActorsSettingsDisable = (props) => {
  const {
    actor,
    namespace,
    alertSuccess,
    alertError,
    readActor,
  } = props;

  const [submitting, setSubmitting] = useState(false);

  const copy = (key, options) => {
    return i18n.t(`${namespace}:settings.disablePrompts.${key}`, options);
  };

  // `enabled` arrives from the API. It has been in the response since
  // MapNodeItem started assigning it — before that it was declared and never
  // populated, so this card would have read every actor as disabled.
  const isEnabled = actor.enabled !== false;

  const submit = () => {
    setSubmitting(true);

    return api[namespace][singularize(namespace)].lifecycle
      .setEnabled(actor, !isEnabled)
      .then((response) => {
        if (response.status === 204) {
          // Already in that state. Nothing to celebrate and nothing wrong.
          return readActor(actor.id, namespace);
        }

        alertSuccess(copy(isEnabled ? 'disabled' : 'enabled'));
        return readActor(actor.id, namespace);
      })
      .catch((err) => {
        const status = err && err.response && err.response.status;
        const body = (err && err.response && err.response.data) || {};

        if (status === 409) {
          alertError(body.message || copy('errors.lastSuperAdmin'));
          return null;
        }

        if (status === 403) {
          alertError(copy('errors.forbidden'));
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
        <Typography variant="body2" color="textSecondary" paragraph>
          {copy(isEnabled ? 'description' : 'descriptionDisabled')}
        </Typography>

        {/* The one thing that makes this card worth reading rather than
            skipping: it says what this is NOT. Disabling looks like the other
            two from the outside — the actor stops appearing — and somebody
            reaching for it to remove content permanently would be badly
            surprised. */}
        <Typography variant="body2" color="textSecondary">
          {copy('reversible')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={submit}
          color={isEnabled ? 'secondary' : 'primary'}
          variant="contained"
          disabled={submitting}
          fullWidth
        >
          {copy(isEnabled ? 'action' : 'actionEnable')}
        </Button>
      </CardActions>
    </>
  );
};

ActorsSettingsDisable.propTypes = {
  actor: ActorType.isRequired,
  namespace: PropTypes.string.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  readActor: PropTypes.func.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const { [namespace]: { current: actor } } = state[namespace];
    return { actor, namespace };
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
  )(ActorsSettingsDisable);
};
