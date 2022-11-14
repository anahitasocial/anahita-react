import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import PermissionsEdit from './Edit';
import Progress from '../../../../components/Progress';

import PermissionsType from '../../../../proptypes/actor/Permissions';
import ActorType from '../../../../proptypes/Actor';
import actions from '../../../../actions';
import i18n from '../../../../languages';

let Edit = null;

const ActorsSettingsPermissionsBrowse = (props) => {
  const {
    browseList,
    resetList,
    alertError,
    alertSuccess,
    actor,
    permissions,
    isFetching,
    success,
    error,
    namespace,
  } = props;

  const [editingOpen, setEditingOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    browseList(actor);

    return () => {
      resetList();
    };
  }, [actor.id]);

  useEffect(() => {
    if (error) {
      alertError(i18n.t('prompts:updated.error'));
    }

    if (success) {
      alertSuccess(i18n.t('prompts:updated.success'));
    }
  }, [error, success]);

  useEffect(() => {
    Edit = PermissionsEdit(namespace);
  }, [namespace]);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent(null);
  };

  if (permissions.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <>
      {current &&
        <Edit
          actor={actor}
          node={current}
          open={editingOpen}
          handleClose={handleClose}
        />}
      <List>
        {permissions.allIds.map((permId) => {
          const permission = permissions.byId[permId];
          const key = `app_${permission.id}`;
          const name = i18n.t(`${permission.name.split('_')[1]}:mTitle`);
          return (
            <ListItem
              button
              onClick={() => {
                setCurrent(permission);
                setEditingOpen(true);
              }}
              key={key}
            >
              <ListItemText
                primary={name}
                secondary={permission.description}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

ActorsSettingsPermissionsBrowse.propTypes = {
  actor: ActorType.isRequired,
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  permissions: PermissionsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [namespace]: {
        current: actor,
      },
    } = state[namespace];

    const {
      [`${namespace}_permissions`]: permissions,
      isFetching,
      error,
      success,
    } = state[`${namespace}Permissions`];

    return {
      actor,
      permissions,
      namespace,
      error,
      success,
      isFetching,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      browseList: (params) => {
        return dispatch(actions[namespace].settings.permissions.browse(params));
      },
      resetList: () => {
        return dispatch(actions[namespace].settings.permissions.reset());
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
  )(ActorsSettingsPermissionsBrowse);
};
