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

import AppsIcon from '@material-ui/icons/Apps';


import AppsType from '../../../proptypes/settings/Apps';
import AppType from '../../../proptypes/settings/App';
import * as actions from '../../../actions';

const SettingsAppsEdit = (props) => {
  const {
    readApp,
    editApp,
    node,
    open,
    apps: {
      current: app = { ...AppType },
    },
    handleClose,
    isFetching,
  } = props;

  useEffect(() => {
    readApp(node);
  }, []);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    editApp(app).then(() => {
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

SettingsAppsEdit.propTypes = {
  readApp: PropTypes.func.isRequired,
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
    readApp: (app) => {
      return dispatch(actions.settings.apps.read(app));
    },
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
