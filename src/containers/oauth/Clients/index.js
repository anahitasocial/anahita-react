import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';

import OAuthClients from './OAuthClients';
import OAuthClientForm from './OAuthClientForm';
import PersonType from '../../../proptypes/Person';
import api from '../../../api';
import actions from '../../../actions';
import permissions from '../../../permissions';

const OAuthClientsBrowse = ({
  setAppTitle,
  alertError,
  alertSuccess,
  viewer,
}) => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const fetchList = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await api.oauthClients.browse();
      setItems(response.data.data || []);
    } catch (err) {
      const message = (err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Failed to load OAuth clients';
      alertError(message);
    } finally {
      setIsFetching(false);
    }
  }, [alertError]);

  useEffect(() => {
    setAppTitle('OAuth Clients');
  }, [setAppTitle]);

  useEffect(() => {
    if (permissions.oauthClient.canBrowse(viewer)) {
      fetchList();
    }
  }, [fetchList, viewer]);

  const handleAdd = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this OAuth client? This cannot be undone.')) {
      return;
    }
    try {
      await api.oauthClients.deleteItem(id);
      setItems((prev) => { return prev.filter((c) => { return c.id !== id; }); });
      alertSuccess('OAuth client deleted');
    } catch (err) {
      const message = (err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Failed to delete OAuth client';
      alertError(message);
    }
  };

  const handleSave = async (clientData) => {
    try {
      if (editingClient) {
        const response = await api.oauthClients.edit({
          ...clientData,
          id: editingClient.id,
        });
        const updated = response.data.data || response.data;
        setItems((prev) => {
          return prev.map((c) => { return c.id === updated.id ? updated : c; });
        });
        alertSuccess('OAuth client updated');
      } else {
        const response = await api.oauthClients.add(clientData);
        const created = response.data.data || response.data;
        setItems((prev) => { return [...prev, created]; });
        alertSuccess('OAuth client created');
      }
      setFormOpen(false);
      setEditingClient(null);
    } catch (err) {
      const message = (err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Failed to save OAuth client';
      alertError(message);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingClient(null);
  };

  if (!permissions.oauthClient.canBrowse(viewer)) {
    return null;
  }

  return (
    <Container>
      <OAuthClients
        items={items}
        isFetching={isFetching}
        canAdd={permissions.oauthClient.canAdd(viewer)}
        canEdit={permissions.oauthClient.canEdit(viewer)}
        canDelete={permissions.oauthClient.canDelete(viewer)}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <OAuthClientForm
        open={formOpen}
        client={editingClient}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </Container>
  );
};

OAuthClientsBrowse.propTypes = {
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
)(OAuthClientsBrowse);
