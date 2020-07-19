import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import AppsIcon from '@material-ui/icons/Apps';

import Progress from '../../components/Progress';

import * as actions from '../../actions';
import AppsType from '../../proptypes/settings/Apps';

const LIMIT = 99;
const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const SettingsApps = (props) => {
  const {
    browseApps,
    resetApps,
    apps,
    error,
    success,
    isFetching,
    queryFilters: {
      sort: initSort,
    },
  } = props;

  const [sort, setSort] = useState(initSort);

  useEffect(() => {
    browseApps({
      sort,
      offset: 0,
      limit: LIMIT,
    });

    return () => {
      resetApps();
    };
  }, []);

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (isFetching) {
    return (
      <Progress />
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h4">Apps</Typography>
        }
        avatar={
          <Avatar>
            <AppsIcon />
          </Avatar>
        }
      />
      <List>
        {apps.allIds.map((appId) => {
          const app = apps.byId[appId];
          const key = `app_${app.id}`;
          return (
            <ListItem key={key} divider>
              <ListItemText
                primary={app.name}
                secondary={app.package}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};


SettingsApps.propTypes = {
  browseApps: PropTypes.func.isRequired,
  resetApps: PropTypes.func.isRequired,
  apps: AppsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  queryFilters: PropTypes.object,
};

SettingsApps.defaultProps = {
  queryFilters: {
    sort: SORT.NAME,
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseApps: (params) => {
      return dispatch(actions.settings.apps.browse(params));
    },
    resetApps: () => {
      return dispatch(actions.settings.apps.reset());
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
)(SettingsApps);
