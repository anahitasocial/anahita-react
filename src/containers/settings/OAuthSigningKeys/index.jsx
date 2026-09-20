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
import OAuthSigningKeys from './OAuthSigningKeys';

const errorMessage = (err) => {
  const response = err && err.response;
  const data = (response && response.data) || {};

  // The guard that matters. The repository refuses, atomically, to let
  // the last active key be switched off — with none the server cannot
  // sign, and every sign-in on the site stops. Named rather than
  // reported as a generic failure, because it is a safety rail doing
  // its job and not a fault.
  if (data.error === 'last_active_key') {
    return i18n.t('settings:oauthSigningKeys.errors.lastActiveKey');
  }

  if (response && response.status === 403) {
    return i18n.t('settings:oauthSigningKeys.errors.forbidden');
  }

  return data.description || data.message || i18n.t('settings:oauthSigningKeys.errors.edit');
};

// The keys that sign every token this site issues.
//
// Browse and toggle only. There is no add and no delete because
// auth-service exposes neither: keys are seeded at deploy time and
// retired by DeleteExpired. Offering the buttons would promise
// something the server cannot do.
//
// Toggling requires a proof of presence within the last five minutes —
// passkey, passcode or password — which the server asks for with a 403
// that opens the step-up dialog.
const OAuthSigningKeysContainer = ({
  alertError,
  alertSuccess,
  viewer,
}) => {
  const [items, setItems] = useState([]);
  const [publishedKids, setPublishedKids] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [pendingKid, setPendingKid] = useState(null);

  const {
    stepUpOpen,
    runGuarded,
    onVerified,
    onCancel,
  } = useStepUp();

  const canEdit = permissions.oauthSigningKey.canEdit(viewer);

  const fetchAll = useCallback(() => {
    setIsFetching(true);

    // Two independent reads, resolved together. The registry is what
    // the server believes; JWKS is what verifiers can actually see.
    // They disagree in normal operation — a key switched on a moment
    // ago has not reached anybody's cache yet — and the table says so
    // rather than reporting one as the whole truth.
    return Promise.all([
      api.oauthSigningKeys.browse()
        .then(({ data }) => {
          return data.data || [];
        }),
      api.oauthSigningKeys.jwks()
        .then(({ data }) => {
          return ((data && data.keys) || []).map((key) => {
            return key.kid;
          });
        })
        // JWKS is a nicety, not the point of the screen. If it cannot
        // be read the column says "unknown" instead of the table
        // failing to render.
        .catch(() => {
          return null;
        }),
    ])
      .then(([keys, kids]) => {
        setItems(keys);
        setPublishedKids(kids);
      })
      .catch((err) => {
        alertError(errorMessage(err));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [alertError]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleToggle = (key, active) => {
    setPendingKid(key.keyId);

    return runGuarded(
      () => {
        return api.oauthSigningKeys.edit(key.keyId, active)
          .then(({ data }) => {
            setItems((previous) => {
              return previous.map((item) => {
                return item.keyId === data.keyId ? data : item;
              });
            });
            alertSuccess(active ?
              i18n.t('settings:oauthSigningKeys.alerts.activated') :
              i18n.t('settings:oauthSigningKeys.alerts.deactivated'));
          })
          .finally(() => {
            setPendingKid(null);
          });
      },
      (err) => {
        alertError(errorMessage(err));
      },
    )
      // Released on the step-up path too. runGuarded resolves without
      // touching the inner finally when it intercepts a 403, so
      // without this the switch would stay frozen behind the dialog
      // and the replayed toggle would have nothing to release.
      .finally(() => {
        setPendingKid(null);
      });
  };

  return (
    <>
      <OAuthSigningKeys
        items={items}
        publishedKids={publishedKids}
        isFetching={isFetching}
        canEdit={canEdit}
        pendingKid={pendingKid}
        onToggle={handleToggle}
      />
      <StepUp
        open={stepUpOpen}
        onVerified={onVerified}
        onCancel={onCancel}
      />
    </>
  );
};

OAuthSigningKeysContainer.propTypes = {
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
)(OAuthSigningKeysContainer);
