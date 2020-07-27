import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import AppsIcon from '@material-ui/icons/Apps';

import MetaForm from '../../../components/settings/meta/Form';
import AppsType from '../../../proptypes/settings/Apps';
import AppType from '../../../proptypes/settings/App';
import * as actions from '../../../actions';
import form from '../../../utils/form';
import utils from '../utils';

const SettingsAppsEdit = (props) => {
  const {
    editApp,
    node,
    open,
    apps,
    handleClose,
    isFetching,
  } = props;

  const app = apps.byId[node.id];
  const namespace = app.package.split('_')[1];
  const { meta: formControllers = [] } = app;

  const formControllerKeys = utils.getFormControllerKeys(formControllers);
  const formFields = form.createFormFields(formControllerKeys);
  const [fields, setFields] = useState(formFields);

  const newEntity = utils.getMetaEntity(formControllers);
  const [entity, setEntity] = useState(newEntity);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    entity[name] = value;

    const newFields = form.validateField(target, fields);

    setEntity({ ...entity });
    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      editApp({
        id: node.id,
        meta: utils.getMetaURLParams(formData),
      });
    }

    setFields({ ...newFields });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="body"
    >
      <MetaForm
        header={
          <CardHeader
            title={
              <Typography variant="h5">
                {app.name}
              </Typography>
            }
            subheader={app.package}
            avatar={
              <Avatar>
                <AppsIcon />
              </Avatar>
            }
          />
        }
        nodeId={app.id}
        namespace={`app.${namespace}`}
        formControllers={formControllers}
        meta={entity}
        fields={formFields}
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        handleClose={handleClose}
        isFetching={isFetching}
      />
    </Dialog>
  );
};

SettingsAppsEdit.propTypes = {
  editApp: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  node: AppType.isRequired,
  open: PropTypes.bool,
  apps: AppsType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

SettingsAppsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    editApp: (app) => {
      return dispatch(actions.settings.apps.edit(app));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_apps: apps,
    error,
    success,
    isFetching,
  } = state.settingsApps;

  return {
    apps,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAppsEdit);
