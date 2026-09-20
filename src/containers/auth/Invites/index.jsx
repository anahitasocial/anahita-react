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

import Invites from './Invites';
import InviteForm from './InviteForm';

const SITE_NAME = process.env.REACT_APP_NAME;

// Several of these refusals are ordinary and self-inflicted, and the
// server writes a usable sentence for them. Where it does, that
// sentence is preferred over anything written here: the cap message
// names the number outstanding and says how a slot frees, which no
// generic string can.
const errorMessage = (err, fallbackKey) => {
  const response = err && err.response;
  const status = response && response.status;
  const data = response && response.data;

  // 429 comes back with no body on purpose. The per-recipient counter
  // is deliberately silent — saying "that address has been invited too
  // often" would disclose somebody else's mail, including who invited
  // them.
  if (status === 429) {
    return i18n.t('invites:errors.rateLimited');
  }

  if (typeof data === 'string' && data) {
    return data;
  }

  if (status === 409) {
    return i18n.t('invites:errors.conflict');
  }

  if (status === 403) {
    return i18n.t('invites:errors.forbidden');
  }

  return (data && (data.message || data.description)) || i18n.t(fallbackKey);
};

// The viewer's own invites.
//
// Its own page rather than a tab in settings, and now for a stronger
// reason than when it was moved: who may invite is a server setting
// that can be opened to every registered person, while settings is
// super-admin-only.
//
// Scoped to the viewer by the server, on created_by. It used to return
// every invite on the site, which meant any administrator opening this
// page read the addresses of everybody every other administrator had
// invited — people with no account here, who never agreed to appear on
// anybody's screen. That scoping is also what makes it safe to show
// this page to somebody who is not an administrator at all.
const InvitesPage = ({
  setAppTitle,
  alertError,
  alertSuccess,
  viewer,
  invitesFrom = '',
}) => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  // Reading your own list is self-service; issuing depends on the
  // server's INVITES_FROM, which arrives through NodeInfo.
  const canBrowse = permissions.invite.canBrowse(viewer);
  const canAdd = permissions.invite.canAdd(viewer, invitesFrom);

  // canDeleteOwn, not canDelete: every row here was issued by the
  // viewer, and withdrawing your own invitation is your own action.
  // Gating the button on canDelete would leave somebody able to send
  // an invitation and not take it back — and the cap only frees when
  // they can.
  const canDelete = permissions.invite.canDeleteOwn(viewer, invitesFrom);

  useEffect(() => {
    setAppTitle(i18n.t('invites:cTitle'));
  }, [setAppTitle]);

  const fetchList = useCallback(() => {
    if (!canBrowse) {
      return Promise.resolve();
    }

    setIsFetching(true);

    return api.invites.browse()
      .then(({ data }) => {
        setItems(data.data || []);
      })
      .catch((err) => {
        alertError(errorMessage(err, 'invites:errors.browse'));
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [alertError, canBrowse]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleAdd = (email) => {
    return api.invites.add(email)
      .then(({ data }) => {
        setItems((previous) => {
          return [data, ...previous];
        });
        setFormOpen(false);
        alertSuccess(i18n.t('invites:alerts.sent', { email }));
      })
      .catch((err) => {
        alertError(errorMessage(err, 'invites:errors.add'));
        // Rethrown so the form stays open with the address still in it.
        // Every refusal here is worth a second attempt — a cap frees, a
        // rate limit lapses — and clearing the field would make each
        // one cost the typing.
        throw err;
      });
  };

  const handleDelete = (invite) => {
    return api.invites.deleteItem(invite.id)
      .then(() => {
        setItems((previous) => {
          return previous.filter((item) => {
            return item.id !== invite.id;
          });
        });
        alertSuccess(i18n.t('invites:alerts.revoked', {
          email: invite.recipientEmail,
        }));
      })
      .catch((err) => {
        alertError(errorMessage(err, 'invites:errors.delete'));
      });
  };

  // After the hooks, so every render runs the same ones.
  if (!canBrowse) {
    return (
      <Container maxWidth="sm">
        <HeaderMeta title={`${i18n.t('invites:cTitle')} - ${SITE_NAME}`} />
        <Typography variant="h6" gutterBottom>
          {i18n.t('invites:restricted.cTitle')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {i18n.t('invites:restricted.cDescription')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <HeaderMeta title={`${i18n.t('invites:cTitle')} - ${SITE_NAME}`} />
      <Invites
        items={items}
        isFetching={isFetching}
        canAdd={canAdd}
        canDelete={canDelete}
        onAdd={() => {
          setFormOpen(true);
        }}
        onDelete={handleDelete}
      />
      <InviteForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
        }}
        onSave={handleAdd}
      />
    </Container>
  );
};

InvitesPage.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  viewer: PersonType.isRequired,
  invitesFrom: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { viewer } = state.session;
  const { nodeInfo } = state.app;

  return {
    viewer,
    invitesFrom: (nodeInfo && nodeInfo.metadata && nodeInfo.metadata.invitesFrom) || '',
  };
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
)(InvitesPage);
