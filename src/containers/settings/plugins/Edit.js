import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import PluginsIcon from '@material-ui/icons/Extension';


import PluginsType from '../../../proptypes/settings/Plugins';
import PluginType from '../../../proptypes/settings/Plugin';
import * as actions from '../../../actions';

const SettingsPluginsEdit = (props) => {
  const {
    readPlugin,
    editPlugin,
    node,
    open,
    plugins: {
      current: plugin = { ...PluginType },
    },
    handleClose,
    isFetching,
  } = props;

  useEffect(() => {
    readPlugin(node);
  }, []);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    editPlugin(plugin).then(() => {
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <Card>
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
        <CardContent>
          Params go here ...
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
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
};

SettingsPluginsEdit.propTypes = {
  readPlugin: PropTypes.func.isRequired,
  editPlugin: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  node: PluginType.isRequired,
  open: PropTypes.bool,
  plugins: PluginsType.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

SettingsPluginsEdit.defaultProps = {
  open: false,
};

const mapDispatchToProps = (dispatch) => {
  return {
    readPlugin: (plugin) => {
      return dispatch(actions.settings.plugins.read(plugin));
    },
    editPlugin: (plugin) => {
      return dispatch(actions.settings.plugins.edit(plugin));
    },
  };
};

const mapStateToProps = (state) => {
  const {
    settings_plugins: plugins,
    error,
    success,
    isFetching,
  } = state.settingsPlugins;

  return {
    plugins,
    error,
    success,
    isFetching,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsPluginsEdit);
