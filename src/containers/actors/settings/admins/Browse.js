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
import SimpleSnackbar from '../../../../components/SimpleSnackbar';
import Progress from '../../../../components/Progress';

import ActorsType from '../../../../proptypes/Actors';
import ActorType from '../../../../proptypes/Actor';
import * as actions from '../../../../actions';

const ActorsSettingsAdminsBrowse = (props) => {
  const {
    browseAdmins,
    resetAdmins,
    // addAdmin,
    removeAdmin,
    actor,
    admins,
    isFetching,
    success,
    // error,
    namespace,
  } = props;

  if (admins.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  useEffect(() => {
    browseAdmins(actor);

    return () => {
      resetAdmins();
    };
  }, [browseAdmins, resetAdmins, actor]);

  const handleRemove = (admin) => {
    removeAdmin({ actor, admin });
  };

  const AddAdmin = Add(namespace);

  return (
    <React.Fragment>
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
                <ActorAvatar actor={admin} />
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
      {success &&
        <SimpleSnackbar
          isOpen={Boolean(success)}
          message="Updated successfully!"
          type="success"
        />
      }
    </React.Fragment>
  );
};

ActorsSettingsAdminsBrowse.propTypes = {
  actor: ActorType.isRequired,
  browseAdmins: PropTypes.func.isRequired,
  resetAdmins: PropTypes.func.isRequired,
  // addAdmin: PropTypes.func.isRequired,
  removeAdmin: PropTypes.func.isRequired,
  admins: ActorsType.isRequired,
  // error: PropTypes.string.isRequired,
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
      browseAdmins: (params) => {
        return dispatch(actions[namespace].settings.admins.browse(params));
      },
      resetAdmins: () => {
        return dispatch(actions[namespace].settings.admins.reset());
      },
      addAdmin: (params) => {
        return dispatch(actions[namespace].settings.admins.add(params));
      },
      removeAdmin: (params) => {
        return dispatch(actions[namespace].settings.admins.deleteItem(params));
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
