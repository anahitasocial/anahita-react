import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import PropTypes from 'prop-types';
import ActorType from '../../proptypes/Actor';
import ActorBodyAbout from './body/About';

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
    stories,
    socialgraph,
    locations,
    notes,
    photos,
    topics,
    articles,
    todos,
  } = props;

  const [value, setValue] = React.useState('stories');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { gadgets } = actor;

  return (
    <Box className={classes.root}>
      <AppBar
        position="sticky"
        color="default"
        className={classes.appBar}
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
          <Tab label="Stories" value="stories" id="actor-tab-stories" />
          <Tab label="Social Graph" value="socialgraph" id="actor-tab-socialgraph" />
          <Tab label="Locations" value="locations" id="actor-tab-locations" />
          <Tab label="Mentions" value="mentions" id="actor-tab-mentions" />
          <Tab label="Notes" value="notes" id="actor-tab-notes" />
          {gadgets.photos &&
            <Tab label="Photos" value="photos" id="actor-tab-photos" />
          }
          {gadgets.articles &&
            <Tab label="Articles" value="articles" id="actor-tab-articles" />
          }
          {gadgets['topics-gadget'] &&
            <Tab label="Topics" value="topics" id="actor-tab-topics" />
          }
          {gadgets['todos-gadget-profile-todos'] &&
            <Tab label="Todos" value="todos" id="actor-tab-todos" />
          }
        </Tabs>
      </AppBar>
      {value === 'stories' &&
      <Grid container spacing={2}>
        <Grid item sm={4}>
          {actor.body && <ActorBodyAbout actor={actor} />}
        </Grid>
        <Grid item sm={8}>{stories}</Grid>
      </Grid>
      }
      {value === 'notes' && notes}
      {gadgets.photos && value === 'photos' && photos}
      {gadgets.articles && value === 'articles' && articles}
      {gadgets['topics-gadget'] && value === 'topics' && topics}
      {gadgets['todos-gadget-profile-todos'] && value === 'todos' && todos}
    </Box>
  );
};

ActorBody.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType.isRequired,
  stories: PropTypes.node,
  socialgraph: PropTypes.node,
  locations: PropTypes.node,
  notes: PropTypes.node,
  photos: PropTypes.node,
  topics: PropTypes.node,
  articles: PropTypes.node,
  todos: PropTypes.node,
};

ActorBody.defaultProps = {
  stories: null,
  socialgraph: null,
  locations: null,
  notes: null,
  photos: null,
  topics: null,
  articles: null,
  todos: null,
};

export default withStyles(styles)(ActorBody);
