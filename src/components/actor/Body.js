import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';
import ActorBodyAbout from './body/About';
import i18n from '../../languages';
import utils from '../../utils';

const { getNamespace, getActorFeatureTabs } = utils.node;

const styles = (theme) => {
  return {
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    appBar: {
      marginBottom: theme.spacing(2),
    },
  };
};

const ActorBody = (props) => {
  const {
    classes,
    actor,
    viewer,
    admins,
    composers,
    feed,
    locations,
    socialgraph,
    tabPanels,
    mentions,
    selectedTab,
  } = props;

  const namespace = getNamespace(actor);
  const featureTabs = getActorFeatureTabs(actor);
  const defaultTab = featureTabs[0] || 'feed';

  const [value, setValue] = useState(selectedTab || defaultTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTabLabel = (tab) => {
    if (tab === 'feed') {
      return i18n.t(`${namespace}:mTitle`);
    }
    if (tab === 'socialgraph') {
      return i18n.t('socialgraph:mTitle');
    }
    return i18n.t(`${tab}:mTitle`);
  };

  return (
    <Box className={classes.root}>
      <AppBar
        position="static"
        color="default"
        className={classes.appBar}
        elevation={1}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Profile Tabs"
        >
          {featureTabs.map((tab) => {
            return (
              <Tab
                label={getTabLabel(tab)}
                value={tab}
                key={`${namespace}-${tab}-tab`}
              />
            );
          })}
        </Tabs>
      </AppBar>

      {value === 'feed' && (
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {actor.body && (
                <Grid item xs={12}>
                  <ActorBodyAbout actor={actor} />
                </Grid>
              )}
              {admins && (
                <Grid item xs={12}>
                  {admins}
                </Grid>
              )}
              {locations && (
                <Grid item xs={12}>
                  {locations}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid item xs={12}>
              {composers}
            </Grid>
            <Grid item xs={12}>
              {feed}
            </Grid>
          </Grid>
        </Grid>
      )}

      {value === 'socialgraph' && socialgraph}

      {tabPanels[value] && tabPanels[value]}

      {actor.id === viewer.id && value === 'mentions' && mentions}
    </Box>
  );
};

ActorBody.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
  composers: PropTypes.node,
  feed: PropTypes.node,
  locations: PropTypes.node,
  admins: PropTypes.node,
  socialgraph: PropTypes.node,
  tabPanels: PropTypes.objectOf(PropTypes.node),
  mentions: PropTypes.node,
  selectedTab: PropTypes.string,
};

ActorBody.defaultProps = {
  admins: null,
  composers: null,
  feed: null,
  locations: null,
  socialgraph: null,
  mentions: null,
  tabPanels: {},
  selectedTab: null,
};

export default withStyles(styles)(ActorBody);
