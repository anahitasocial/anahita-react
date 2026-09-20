import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import HeaderMeta from '../../../components/HeaderMeta';
import actions from '../../../actions';
import api from '../../../api';
import i18n from '../../../languages';
import permissions from '../../../permissions';
import PersonType from '../../../proptypes/Person';

import SignupRequests from './SignupRequests';
import DecisionDialog from './DecisionDialog';

const SITE_NAME = process.env.REACT_APP_NAME;

// Every refusal here has a cause worth naming, because each one means
// something different about what to do next.
const errorMessage = (err, fallbackKey) => {
  const response = err && err.response;
  const data = (response && response.data) || {};

  switch (data.error) {
    // Somebody registered the name while the request sat in the queue.
    // The applicant has to choose another, so the way forward is to
    // reject with a note rather than to retry.
    case 'username_taken':
      return i18n.t('signupRequests:errors.usernameTaken');
    // Another administrator answered it first. The list is stale, not
    // wrong, so it is refreshed underneath this message.
    case 'already_decided':
      return i18n.t('signupRequests:errors.alreadyDecided');
    // They never confirmed their address. Approving would create an
    // account on an address nobody has shown they can receive mail at,
    // which is the whole point of the confirmation step.
    case 'not_verified':
      return i18n.t('signupRequests:errors.notVerified');
    default:
      return data.message || i18n.t(fallbackKey);
  }
};

// The approval queue behind REGISTRATION_MODE=approval.
//
// Its own page, not a tab in settings. Deciding who joins is ordinary
// moderation and auth-service gates it on IsAdminOrSuperAdmin, while
// settings is super-admin-only — putting this behind that door would
// have left administrators holding a permission with no screen to use
// it on.
//
// Only pending requests are listed. A decided one is kept in the table
// for the record and never returned here, so the queue is the work
// outstanding rather than a history to page through.
const SignupRequestsPage = ({
  setAppTitle,
  alertError,
  alertSuccess,
  viewer,
}) => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [deciding, setDeciding] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canBrowse = permissions.signupRequest.canBrowse(viewer);
  const canApprove = permissions.signupRequest.canApprove(viewer);
  const canReject = permissions.signupRequest.canReject(viewer);

  useEffect(() => {
    setAppTitle(i18n.t('signupRequests:cTitle'));
  }, [setAppTitle]);

  const fetchList = useCallback(() => {
    if (!canBrowse) {
      return Promise.resolve();
    }

    setIsFetching(true);

    return api.signupRequests.browse()
      .then(({ data }) => {
        setItems(data.data || []);
      })
      .catch((err) => {
        alertError(errorMessage(err, 'signupRequests:errors.browse'));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [alertError, canBrowse]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDecision = (note) => {
    const { request, decision } = deciding;
    const call = decision === 'approve' ?
      api.signupRequests.approve :
      api.signupRequests.reject;

    setSubmitting(true);

    return call(request.id, note)
      .then(() => {
        // Dropped from the list rather than re-fetched. It is decided
        // and will not come back from browse, and re-reading the whole
        // queue to learn that would make every decision flicker.
        setItems((previous) => {
          return previous.filter((item) => {
            return item.id !== request.id;
          });
        });
        setDeciding(null);
        alertSuccess(decision === 'approve' ?
          i18n.t('signupRequests:alerts.approved', {
            username: request.username,
          }) :
          i18n.t('signupRequests:alerts.rejected', {
            username: request.username,
          }));
      })
      .catch((err) => {
        alertError(errorMessage(err, `signupRequests:errors.${decision}`));

        // A 409 means this row no longer reflects the server —
        // somebody else decided it, or the username went while it
        // waited. Re-read so the queue stops offering a decision that
        // cannot be made, instead of leaving a row that fails on every
        // further click.
        const status = err && err.response && err.response.status;
        if (status === 409) {
          setDeciding(null);
          fetchList();
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // After the hooks, so every render runs the same ones.
  if (!canBrowse) {
    return (
      <Container maxWidth="sm">
        <HeaderMeta title={`${i18n.t('signupRequests:cTitle')} - ${SITE_NAME}`} />
        <Typography variant="h6" gutterBottom>
          {i18n.t('signupRequests:restricted.cTitle')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {i18n.t('signupRequests:restricted.cDescription')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <HeaderMeta title={`${i18n.t('signupRequests:cTitle')} - ${SITE_NAME}`} />
      <SignupRequests
        items={items}
        isFetching={isFetching}
        canApprove={canApprove}
        canReject={canReject}
        onDecide={(request, decision) => {
          setDeciding({ request, decision });
        }}
      />
      <DecisionDialog
        deciding={deciding}
        submitting={submitting}
        onClose={() => {
          setDeciding(null);
        }}
        onConfirm={handleDecision}
      />
    </Container>
  );
};

SignupRequestsPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
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
    setAppTitle: (title) => {
      return dispatch(actions.app.setAppTitle(title));
    },
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
)(SignupRequestsPage);
