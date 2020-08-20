import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import PermissionsEdit from './Edit';
import Progress from '../../../../components/Progress';
import SimpleSnackbar from '../../../../components/SimpleSnackbar';

import PermissionsType from '../../../../proptypes/actor/Permissions';
import ActorType from '../../../../proptypes/Actor';
import * as actions from '../../../../actions';
import i18n from '../../../../languages';

const ActorsSettingsPermissionsBrowse = (props) => {
  const {
    browsePermissions,
    resetPermissions,
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
    browsePermissions(actor);

    return () => {
      resetPermissions();
    };
  }, [browsePermissions, resetPermissions, actor]);

  const handleClose = () => {
    setEditingOpen(false);
    setCurrent(null);
  };

  const Edit = PermissionsEdit(namespace);

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (permissions.allIds.length === 0 && isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <React.Fragment>
      {current &&
        <Edit
          actor={actor}
          node={current}
          open={editingOpen}
          handleClose={handleClose}
        />
      }
      <List>
        {permissions.allIds.map((permId) => {
          const permission = permissions.byId[permId];
          const key = `app_${permission.id}`;
          const name = i18n.t(`${permission.name.split('_')[1]}:mTitle`);
          return (
            <ListItem
              divider
              button
              onClick={() => {
                setCurrent(permission);
                setEditingOpen(true);
              }}
              key={key}
            >
              <ListItemText
                primary={name}
              />
            </ListItem>
          );
        })}
      </List>
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
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

ActorsSettingsPermissionsBrowse.propTypes = {
  actor: ActorType.isRequired,
  browsePermissions: PropTypes.func.isRequired,
  resetPermissions: PropTypes.func.isRequired,
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
      browsePermissions: (params) => {
        return dispatch(actions[namespace].settings.permissions.browse(params));
      },
      resetPermissions: () => {
        return dispatch(actions[namespace].settings.permissions.reset());
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
