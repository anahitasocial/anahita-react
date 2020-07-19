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

import PluginsIcon from '@material-ui/icons/Extension';

import Progress from '../../components/Progress';

import * as actions from '../../actions';
import PluginsType from '../../proptypes/settings/Plugins';

const LIMIT = 99;
const SORT = {
  NAME: 'name',
  ORDERING: 'ordering',
};

const SettingsPlugins = (props) => {
  const {
    browsePlugins,
    resetPlugins,
    plugins,
    error,
    success,
    isFetching,
    queryFilters: {
      sort: initSort,
    },
  } = props;

  const [sort, setSort] = useState(initSort);

  useEffect(() => {
    browsePlugins({
      sort,
      offset: 0,
      limit: LIMIT,
    });

    return () => {
      resetPlugins();
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
          <Typography variant="h4">Plugins</Typography>
        }
        avatar={
          <Avatar>
            <PluginsIcon />
          </Avatar>
        }
      />
      <List>
        {plugins.allIds.map((pluginId) => {
          const plugin = plugins.byId[pluginId];
          const key = `app_${plugin.id}`;
          return (
            <ListItem key={key} divider>
              <ListItemText
                primary={plugin.name}
                secondary={`${plugin.element} (${plugin.type})`}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};


SettingsPlugins.propTypes = {
  browsePlugins: PropTypes.func.isRequired,
  resetPlugins: PropTypes.func.isRequired,
  plugins: PluginsType.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  queryFilters: PropTypes.object,
};

SettingsPlugins.defaultProps = {
  queryFilters: {
    sort: SORT.NAME,
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    browsePlugins: (params) => {
      return dispatch(actions.settings.plugins.browse(params));
    },
    resetPlugins: () => {
      return dispatch(actions.settings.plugins.reset());
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
)(SettingsPlugins);
