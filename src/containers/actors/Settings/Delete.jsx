import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ActorDeleteForm from '../Forms/Delete';
import Progress from '../../../components/Progress';
import actions from '../../../actions';
import form from '../../../utils/form';
import i18n from '../../../languages';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';

const formFields = form.createFormFields(['alias']);

// Mirrors constants.AccountGraceDays in auth-service and GraceDays in the
// sweeper. Used only to tell the person the date they have until.
const GRACE_DAYS = 30;

// purgeDate is the day the sweeper will erase the profile, formatted for
// somebody to read and act on.
//
// Computed client-side because the delete response carries no body. That is
// accurate to the day, which is what the person needs — the sweeper runs
// hourly against the same window, so the two cannot drift by more than an hour.
const purgeDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + GRACE_DAYS);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ActorsSettingsDelete = (props) => {
  const {
    deleteActor,
    restoreActor,
    readActor,
    logout,
    alertSuccess,
    alertError,
    actor,
    viewer,
    isFetching,
    namespace,
  } = props;
  const navigate = useNavigate();
  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  // Undo, for a group whose grace period has not run out.
  //
  // Re-reads the actor rather than trusting the response, so the card flips
  // back to the delete form from the store the rest of the page reads —
  // otherwise it would still believe the group was scheduled.
  const handleOnRestore = () => {
    restoreActor(actor)
      .then(() => {
        alertSuccess(i18n.t(`${namespace}:settings.deletePrompts.restored`));
        return readActor(actor.id, namespace);
      })
      .catch(() => {
        // 404 means the sweeper reached it first. There is no second chance,
        // so the message says so rather than inviting a retry.
        alertError(i18n.t(`${namespace}:settings.deletePrompts.errors.restoreFailed`));
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const isViewer = actor.id === viewer.id;
      deleteActor(actor)
        .then(() => {
          // Deleting your own profile signs you out — every session was
          // revoked server-side the moment it was scheduled, so staying on
          // the page would only mean discovering that on the next request.
          if (isViewer) {
            logout();
            alertSuccess(i18n.t('actor:delete.scheduled', {
              date: purgeDate(),
            }));
          } else {
            alertSuccess(i18n.t('prompts:deleted.success'));
          }

          navigate(`/${namespace}/`, { replace: true });
        })
        .catch((err) => {
          // There was no catch here at all. actions/create.js rejects the
          // outer promise, so every failure was an unhandled rejection and
          // the person saw nothing happen — no error, no navigation, just a
          // button that had stopped working.
          const status = err && err.response && err.response.status;

          if (status === 403) {
            alertError(i18n.t('actor:delete.errors.forbidden'));
            return;
          }

          alertError(i18n.t('actor:delete.errors.generic'));
        });
    }

    setFields({ ...newFields });
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <ActorDeleteForm
      fields={fields}
      actor={actor}
      namespace={namespace}
      isFetching={isFetching}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      handleOnRestore={handleOnRestore}
    />
  );
};

ActorsSettingsDelete.propTypes = {
  deleteActor: PropTypes.func.isRequired,
  restoreActor: PropTypes.func.isRequired,
  readActor: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
      success,
      isFetching,
    } = state[namespace];

    const { viewer } = state.session;

    return {
      actor,
      viewer,
      namespace,
      isFetching,
      success,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      deleteActor: (actor) => {
        return dispatch(actions[namespace].deleteItem(actor));
      },
      restoreActor: (actor) => {
        return dispatch(actions[namespace].restore(actor));
      },
      readActor: (id) => {
        return dispatch(actions[namespace].read(id, namespace));
      },
      logout: () => {
        return dispatch(actions.session.deleteItem());
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
  )(ActorsSettingsDelete);
};
