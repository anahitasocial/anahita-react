import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { singularize } from 'inflection';
import ActorDeleteForm from '../Forms/Delete';
import StepUp from '../../auth/StepUp';
import api from '../../../api';
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
  const [stepUpOpen, setStepUpOpen] = useState(false);

  // What the deletion would cost. null while unknown, and the form renders
  // without it rather than blocking — the figures make the warning concrete,
  // but a slow or failing count must not stand between somebody and a
  // decision they are entitled to make.
  const [counts, setCounts] = useState(null);

  // Read when the card mounts, not when the page loads: the Danger zone is a
  // tab, and a count nobody is about to act on is a query nobody needed.
  //
  // Failure is silent on purpose. A 403 here means the viewer may not delete
  // this profile, which the delete itself will say far more clearly than an
  // error toast on a tab they just opened.
  useEffect(() => {
    let live = true;

    if (actor.id) {
      api[namespace][singularize(namespace)].deletioncounts.read(actor)
        .then((response) => {
          if (live) {
            setCounts(response.data);
          }
          return response;
        })
        .catch(() => {
          return null;
        });
    }

    // Guards against setting state on an unmounted card: the Danger zone is a
    // tab, and switching away before the counts land would otherwise warn.
    return () => {
      live = false;
    };
  }, [actor.id, namespace]);

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

  // The deletion itself, separated from the form event so the step-up dialog
  // can run it again after a proof arrives. Without this the retry would have
  // to synthesise a submit event, and the form is gone from the DOM by then.
  const submitDelete = () => {
    const isViewer = actor.id === viewer.id;
    return deleteActor(actor)
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
        const body = (err && err.response && err.response.data) || {};

        // 403 carries two different meanings here, and telling them apart
        // is what stops a loop: "step_up_required" opens the dialog, while
        // a plain 403 means this viewer may not delete the profile at all.
        // Opening the dialog for the second would have the person prove
        // themselves, retry, be refused, and be shown the dialog again with
        // no way out.
        if (status === 403 && body.error === 'step_up_required') {
          setStepUpOpen(true);
          return;
        }

        if (status === 403) {
          alertError(i18n.t('actor:delete.errors.forbidden'));
          return;
        }

        // The last super administrator. The server's message names the way
        // out — promote somebody else, or step down first — and it is more
        // specific than anything worth restating here.
        if (status === 409) {
          alertError(body.message || i18n.t('actor:delete.errors.lastSuperAdmin'));
          return;
        }

        alertError(i18n.t('actor:delete.errors.generic'));
      });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      submitDelete();
    }

    setFields({ ...newFields });
  };

  if (!actor.id && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <>
      <ActorDeleteForm
        fields={fields}
        actor={actor}
        counts={counts}
        namespace={namespace}
        isFetching={isFetching}
        handleOnChange={handleOnChange}
        handleOnSubmit={handleOnSubmit}
        handleOnRestore={handleOnRestore}
      />
      <StepUp
        open={stepUpOpen}
        onVerified={() => {
          setStepUpOpen(false);
          submitDelete();
        }}
        onCancel={() => {
          return setStepUpOpen(false);
        }}
      />
    </>
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
