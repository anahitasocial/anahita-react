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
import actions from '../../../actions';
import utils from '../../../utils';

const {
  form,
  settings,
} = utils;

const SettingsAppsEdit = (props) => {
  const {
    editItem,
    node,
    open,
    items,
    handleClose,
    isFetching,
  } = props;

  const app = items.byId[node.id];
  const namespace = app.package.split('_')[1];
  const { meta: formControllers = [] } = app;

  const formControllerKeys = settings.getFormControllerKeys(formControllers);
  const formFields = form.createFormFields(formControllerKeys);
  const [fields, setFields] = useState(formFields);

  const newEntity = settings.getMetaEntity(formControllers);
  const [entity, setEntity] = useState(newEntity);
  const [enabled, setEnabled] = useState(app.enabled);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value, checked } = target;

    if (name === 'enabled') {
      setEnabled(Boolean(checked));
    } else {
      entity[name] = value;
    }

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
      editItem({
        id: node.id,
        meta: settings.getMetaURLParams(formData),
        enabled,
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
        enabled={enabled}
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
  editItem: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  node: AppType.isRequired,
  open: PropTypes.bool,
  items: AppsType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

SettingsAppsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    editItem: (app) => {
      return dispatch(actions.settings.apps.edit(app));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_apps: items,
    error,
    success,
    isFetching,
  } = state.settingsApps;

  return {
    items,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsAppsEdit);
