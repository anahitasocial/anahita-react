import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import RemoveIcon from '@material-ui/icons/Remove';

import Add from './Add';
import ActorAvatar from '../../../../components/actor/Avatar';
import Progress from '../../../../components/Progress';

import ActorsType from '../../../../proptypes/Actors';
import ActorType from '../../../../proptypes/Actor';
import actions from '../../../../actions';
import i18n from '../../../../languages';

const ActorsSettingsAdminsBrowse = (props) => {
  const {
    browseList,
    resetList,
    removeAdmin,
    alertError,
    alertSuccess,
    actor,
    admins,
    isFetching,
    error,
    success,
    namespace,
  } = props;

  if (admins.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

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

  const handleRemove = (admin) => {
    removeAdmin({ actor, admin });
  };

  const AddAdmin = Add(namespace);

  return (
    <>
      <div style={{ margin: 16 }}>
        <AddAdmin />
      </div>
      <List>
        {admins.allIds.map((adminId) => {
          const admin = admins.byId[adminId];
          const key = `admin_${admin.id}`;
          return (
            <ListItem
              key={key}
            >
              <ListItemAvatar>
                <ActorAvatar actor={admin} linked />
              </ListItemAvatar>
              <ListItemText
                primary={admin.name}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    handleRemove(admin);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

ActorsSettingsAdminsBrowse.propTypes = {
  actor: ActorType.isRequired,
  browseList: PropTypes.func.isRequired,
  resetList: PropTypes.func.isRequired,
  removeAdmin: PropTypes.func.isRequired,
  alertSuccess: PropTypes.func.isRequired,
  alertError: PropTypes.func.isRequired,
  admins: ActorsType.isRequired,
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
      [`${namespace}_admins`]: admins,
      isFetching,
      error,
      success,
    } = state[`${namespace}Admins`];

    return {
      actor,
      admins,
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
        return dispatch(actions[namespace].settings.admins.browse(params));
      },
      resetList: () => {
        return dispatch(actions[namespace].settings.admins.reset());
      },
      removeAdmin: (params) => {
        return dispatch(actions[namespace].settings.admins.deleteItem(params));
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
  )(ActorsSettingsAdminsBrowse);
};
