import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import AppIcon from '@material-ui/icons/Apps';

import ActorType from '../../../../proptypes/Actor';
import PermissionsType from '../../../../proptypes/actor/Permissions';
import PermissionType from '../../../../proptypes/actor/Permission';
import actions from '../../../../actions';
import i18n from '../../../../languages';
import utils from '../../../../utils';
import ACCESS from '../../../../constants/access';

const SettingsPermissionsEdit = (props) => {
  const {
    editPermission,
    actor,
    node,
    open,
    permissions,
    handleClose,
    isFetching,
  } = props;

  const actorType = utils.node.isPerson(actor) ? 'PEOPLE' : 'ACTORS';
  const accessOptions = _.values(ACCESS[actorType]);
  const permission = permissions.byId[node.id];
  const [entity, setEntity] = useState(permission.actions);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    entity[name] = value;

    setEntity({ ...entity });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    editPermission({
      actor,
      actions: entity,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      <form onSubmit={handleOnSubmit}>
        <Card variant="outlined">
          <CardHeader
            title={
              <Typography variant="h5">
                {i18n.t(`${node.name.split('_')[1]}:mTitle`)}
              </Typography>
            }
            subheader="Edit Permissions"
            avatar={
              <Avatar>
                <AppIcon />
              </Avatar>
            }
          />
          <CardContent>
            {Object.keys(entity).map((name, index) => {
              const key = `${_.snakeCase(name)}-${index}`;
              const identifier = name.split(':');
              const label = i18n.t(`${identifier[0].split('_')[1]}:settings.${identifier[1]}.${identifier[2]}`);

              return (
                <FormControl
                  key={key}
                  fullWidth
                  margin="normal"
                >
                  <InputLabel id={`${key}-label-id`}>
                    {label}
                  </InputLabel>
                  <Select
                    id={`${key}-id`}
                    labelId={`${key}-label-id`}
                    name={name}
                    value={entity[name]}
                    onChange={handleOnChange}
                    label={label}
                  >
                    {accessOptions.map((option) => {
                      const optionKey = `${key}-${option}`;
                      return (
                        <MenuItem
                          key={optionKey}
                          value={option}
                        >
                          {i18n.t(`access:${option}`)}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            })}
          </CardContent>
          <CardActions>
            <Button
              onClick={handleClose}
              fullWidth
            >
              Close
            </Button>
            <Button
              type="submit"
              fullWidth
              color="primary"
              variant="contained"
              disabled={isFetching}
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </form>
    </Dialog>
  );
};

SettingsPermissionsEdit.propTypes = {
  editPermission: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  node: PermissionType.isRequired,
  open: PropTypes.bool,
  permissions: PermissionsType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

SettingsPermissionsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      editPermission: (actor, permission) => {
        return dispatch(actions[namespace].settings.permissions.edit(actor, permission));
      },
    };
  };
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      [`${namespace}_permissions`]: permissions,
      isFetching,
      error,
      success,
    } = state[`${namespace}Permissions`];

    return {
      permissions,
      namespace,
      error,
      success,
      isFetching,
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(SettingsPermissionsEdit);
};
