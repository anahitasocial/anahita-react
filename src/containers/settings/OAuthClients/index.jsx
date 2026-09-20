import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';
import permissions from '../../../permissions';
import PersonType from '../../../proptypes/Person';

import StepUp from '../../auth/StepUp';
import useStepUp from '../useStepUp';
import OAuthClients from './OAuthClients';
import OAuthClientForm from './OAuthClientForm';
import OAuthClientSecret from './OAuthClientSecret';

// Turns a failed request into something worth reading.
//
// step_up_required never reaches here — useStepUp intercepts it and
// opens the dialog, because it is a routing instruction rather than a
// refusal.
//
// auth-service answers most other refusals with a bare status and no
// body, so there is often nothing to quote; the few that do carry one
// use OAuthErrorResponse's { error, description }.
const errorMessage = (err, fallbackKey) => {
  const response = err && err.response;
  const data = (response && response.data) || {};

  if (data.error === 'invalid_scope') {
    return data.description || i18n.t('settings:oauthClients.errors.invalidScope');
  }

  if (response && response.status === 403) {
    return i18n.t('settings:oauthClients.errors.forbidden');
  }

  return data.description || data.message || i18n.t(fallbackKey);
};

// The OAuth client registry.
//
// Local state, not redux: a handful of rows, no pagination, read when
// the tab opens and thrown away when it closes. The account screens
// hold passkeys and auth logs the same way.
//
// Every write goes through runGuarded. The server requires a proof of
// presence within the last five minutes — by passkey, passcode or
// password — and says so with a 403 the first time, which opens the
// step-up dialog and then replays the write.
const OAuthClientsContainer = ({
  alertError,
  alertSuccess,
  viewer,
}) => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // The plaintext secret, held only long enough to show it once.
  //
  // The server sends it on add and on rotate and can never produce it
  // again — it stores a hash. Dropping it, which the screen this
  // replaces did, leaves the operator with a registration they cannot
  // authenticate and rotation as the only way out.
  const [secret, setSecret] = useState(null);

  const {
    stepUpOpen,
    runGuarded,
    onVerified,
    onCancel,
  } = useStepUp();

  const canAdd = permissions.oauthClient.canAdd(viewer);
  const canEdit = permissions.oauthClient.canEdit(viewer);
  const canDelete = permissions.oauthClient.canDelete(viewer);

  const fetchList = useCallback(() => {
    setIsFetching(true);

    // Not guarded: browsing needs no proof, only the role.
    return api.oauthClients.browse()
      .then(({ data }) => {
        setItems(data.data || []);
      })
      .catch((err) => {
        alertError(errorMessage(err, 'settings:oauthClients.errors.browse'));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [alertError]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (client) => {
    setEditing(client);
    setFormOpen(true);
  };

  const handleDelete = (client) => {
    return runGuarded(
      () => {
        return api.oauthClients.deleteItem(client.id)
          .then(() => {
            setItems((previous) => {
              return previous.filter((item) => {
                return item.id !== client.id;
              });
            });
            alertSuccess(i18n.t('settings:oauthClients.alerts.deleted', {
              name: client.name,
            }));
          });
      },
      (err) => {
        alertError(errorMessage(err, 'settings:oauthClients.errors.delete'));
      },
    );
  };

  const handleRotate = (client) => {
    return runGuarded(
      () => {
        return api.oauthClients.rotateSecret(client.id)
          .then(({ data }) => {
            setItems((previous) => {
              return previous.map((item) => {
                return item.id === data.id ? data : item;
              });
            });
            // Shown instead of an alert, because the alert scrolls
            // away and this is the only copy of the secret that will
            // ever exist.
            setSecret({ client: data, rotated: true });
          });
      },
      (err) => {
        alertError(errorMessage(err, 'settings:oauthClients.errors.rotate'));
      },
    );
  };

  const handleSave = (payload) => {
    if (editing) {
      return runGuarded(
        () => {
          return api.oauthClients.edit({ ...payload, id: editing.id })
            .then(({ data }) => {
              setItems((previous) => {
                return previous.map((item) => {
                  return item.id === data.id ? data : item;
                });
              });
              setFormOpen(false);
              setEditing(null);
              alertSuccess(i18n.t('settings:oauthClients.alerts.edited', {
                name: data.name,
              }));
            });
        },
        (err) => {
          alertError(errorMessage(err, 'settings:oauthClients.errors.edit'));
        },
      );
    }

    return runGuarded(
      () => {
        return api.oauthClients.add(payload)
          .then(({ data }) => {
            setItems((previous) => {
              return [...previous, data];
            });
            setFormOpen(false);

            // Public clients come back without one — PKCE proves their
            // identity at /token instead — so there is nothing to show.
            if (data.clientSecret) {
              setSecret({ client: data, rotated: false });
            } else {
              alertSuccess(i18n.t('settings:oauthClients.alerts.added', {
                name: data.name,
              }));
            }
          });
      },
      (err) => {
        alertError(errorMessage(err, 'settings:oauthClients.errors.add'));
      },
    );
  };

  return (
    <>
      <OAuthClients
        items={items}
        isFetching={isFetching}
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRotate={handleRotate}
      />
      <OAuthClientForm
        open={formOpen}
        client={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
      <OAuthClientSecret
        secret={secret}
        onClose={() => {
          setSecret(null);
        }}
      />
      {/* The form stays mounted behind this with what was typed still
          in it, so a proof collected mid-registration does not cost the
          typing. On success the replayed write closes it. */}
      <StepUp
        open={stepUpOpen}
        onVerified={onVerified}
        onCancel={onCancel}
      />
    </>
  );
};

OAuthClientsContainer.propTypes = {
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  return { viewer };
};

const mapDispatchToProps = (dispatch) => {
  return {
    alertError: (message) => {
      return dispatch(actions.app.alert.error(message));
    },
    alertSuccess: (message) => {
      return dispatch(actions.app.alert.success(message));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OAuthClientsContainer);
