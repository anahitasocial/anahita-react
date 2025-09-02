import React, { useState } from 'react';
import PropTypes from 'prop-types';
import inflector from 'inflector-js';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { singularize } from 'inflection';

import ActorType from '../../proptypes/Actor';
import PersonType from '../../proptypes/Person';
import ActorBodyAbout from './body/About';
import i18n from '../../languages';
import utils from '../../utils';

const { getNamespace } = utils.node;

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
    tabs,
    mentions,
    selectedTab,
  } = props;

  const [value, setValue] = useState(selectedTab || 'stories');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const namespace = getNamespace(actor);
  const actorFeatures = utils.node.getEnabledFeatures(actor);

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
          {actorFeatures.map((feature) => {
            const tab = feature === 'socialgraph' ? feature : inflector.pluralize(feature);
            const label = tab === 'stories' ? singularize(namespace) : i18n.t(`${tab}:mTitle`);
            const key = `${namespace}-${tab}-feed`;
            return (
              <Tab
                label={label}
                value={tab}
                key={key}
              />
            );
          })}
          {/*
          {actor.id === viewer.id &&
            <Tab label="Mentions" value="mentions" id="actor-tab-mentions" />
          }
          */}
        </Tabs>
      </AppBar>
      {value === 'stories' &&
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {actor.body &&
                <Grid item xs={12}>
                  <ActorBodyAbout actor={actor} />
                </Grid>}
              {admins &&
                <Grid item xs={12}>
                  {admins }
                </Grid>}
              {locations &&
                <Grid item xs={12}>
                  {locations}
                </Grid>}
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
        </Grid>}
      {value === 'socialgraph' && socialgraph}
      {typeof (tabs[value]) !== 'undefined' && tabs[value]}
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
  tabs: PropTypes.arrayOf(PropTypes.node),
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
  tabs: null,
  selectedTab: null,
};

export default withStyles(styles)(ActorBody);
