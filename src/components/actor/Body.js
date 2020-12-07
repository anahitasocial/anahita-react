import React from 'react';
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
    stories,
    locations,
    socialgraph,
    articles,
    documents,
    notes,
    photos,
    topics,
    todos,
    mentions,
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
          <Tab label="Stories" value="stories" id="actor-tab-stories" />
          <Tab label="Socialgraph" value="socialgraph" id="actor-tab-socialgraph" />
          <Tab label="Notes" value="notes" id="actor-tab-notes" />
          {gadgets.photos &&
            <Tab label="Photos" value="photos" id="actor-tab-photos" />
          }
          {gadgets.articles &&
            <Tab label="Articles" value="articles" id="actor-tab-articles" />
          }
          {gadgets.documents &&
            <Tab label="Documents" value="documents" id="actor-tab-documents" />
          }
          {gadgets['topics-gadget'] &&
            <Tab label="Topics" value="topics" id="actor-tab-topics" />
          }
          {gadgets['todos-gadget-profile-todos'] &&
            <Tab label="Todos" value="todos" id="actor-tab-todos" />
          }
          {actor.id === viewer.id && <Tab label="Mentions" value="mentions" id="actor-tab-mentions" />}
        </Tabs>
      </AppBar>
      {value === 'stories' &&
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {actor.body &&
                <Grid item xs={12}>
                  <ActorBodyAbout actor={actor} />
                </Grid>
              }
              <Grid item xs={12}>
                {locations}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={8}>
            {stories}
          </Grid>
        </Grid>
      }
      {value === 'socialgraph' && socialgraph}
      {value === 'notes' && notes}
      {gadgets.photos && value === 'photos' && photos}
      {gadgets.articles && value === 'articles' && articles}
      {gadgets.documents && value === 'documents' && documents}
      {gadgets['topics-gadget'] && value === 'topics' && topics}
      {gadgets['todos-gadget-profile-todos'] && value === 'todos' && todos}
      {actor.id === viewer.id && value === 'mentions' && mentions}
    </Box>
  );
};

ActorBody.propTypes = {
  classes: PropTypes.object.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
  stories: PropTypes.node,
  locations: PropTypes.node,
  socialgraph: PropTypes.node,
  notes: PropTypes.node,
  photos: PropTypes.node,
  topics: PropTypes.node,
  articles: PropTypes.node,
  documents: PropTypes.node,
  todos: PropTypes.node,
  mentions: PropTypes.node,
};

ActorBody.defaultProps = {
  stories: null,
  locations: null,
  socialgraph: null,
  notes: null,
  photos: null,
  topics: null,
  articles: null,
  documents: null,
  todos: null,
  mentions: null,
};

export default withStyles(styles)(ActorBody);
