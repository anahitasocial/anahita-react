import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import PluginsIcon from '@material-ui/icons/Extension';

import MetaForm from '../../../components/settings/meta/Form';
import PluginsType from '../../../proptypes/settings/Plugins';
import PluginType from '../../../proptypes/settings/Plugin';
import actions from '../../../actions';
import utils from '../../../utils';

const {
  form,
  settings,
} = utils;

const SettingsPluginsEdit = (props) => {
  const {
    editItem,
    node,
    open,
    items,
    handleClose,
    isFetching,
  } = props;

  const plugin = items.byId[node.id];
  const namespace = `plugin.${plugin.element}.${plugin.type}`;
  const { meta: formControllers = [] } = plugin;

  const formControllerKeys = settings.getFormControllerKeys(formControllers);
  const formFields = form.createFormFields(formControllerKeys);
  const [fields, setFields] = useState(formFields);

  const newEntity = settings.getMetaEntity(formControllers);
  const [entity, setEntity] = useState(newEntity);
  const [enabled, setEnabled] = useState(plugin.enabled);

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
                {plugin.name}
              </Typography>
            }
            subheader={`${plugin.element} (${plugin.type})`}
            avatar={
              <Avatar>
                <PluginsIcon />
              </Avatar>
            }
          />
        }
        nodeId={plugin.id}
        enabled={enabled}
        namespace={namespace}
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

SettingsPluginsEdit.propTypes = {
  editItem: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  node: PluginType.isRequired,
  open: PropTypes.bool,
  items: PluginsType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

SettingsPluginsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    editItem: (node) => {
      return dispatch(actions.settings.plugins.edit(node));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_plugins: items,
    error,
    success,
    isFetching,
  } = state.settingsPlugins;

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
)(SettingsPluginsEdit);
