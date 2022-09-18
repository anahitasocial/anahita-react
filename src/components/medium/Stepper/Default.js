import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import MediumType from '../../../proptypes/Medium';
import ActorTitle from '../../actor/Title';
import ActorAvatar from '../../actor/Avatar';
import CardHeaderOwner from '../../cards/Owner';
import Player from '../../Player';
import EntityBody from '../../EntityBody';
import contentfilter from '../../contentfilter';
import utils from '../../../utils';

const {
  getAuthor,
  getURL,
  getPortraitURL,
} = utils.node;

const styles = (theme) => {
  return {
    portrait: {
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '88vh',
    },
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
    scrollingItem: {
      marginTop: -2,
      height: '88vh',
      overflowY: 'auto',
    },
    buttons: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
  };
};

const TABS = {
  COMMENTS: 'comments',
  LOCATIONS: 'locations',
};

const MediumStepperDefault = (props) => {
  const {
    classes,
    medium,
    actions,
    menu,
    stats,
    locations,
    comments,
    editing,
    form,
    nextAction,
    prevAction,
  } = props;

  const [tab, setTab] = useState(TABS.COMMENTS);

  const changeTab = (event, value) => {
    setTab(value);
  };

  const portrait = getPortraitURL(medium, 'large');
  const url = getURL(medium);
  const author = getAuthor(medium);

  return (
    <Grid
      container
      alignItems="center"
    >
      <Grid
        item
        xs={12}
        md={8}
      >
        <Hidden mdDown>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item md={1}>
              <Box className={classes.buttons}>
                {prevAction}
              </Box>
            </Grid>
            <Grid item md={10}>
              {portrait &&
                <img
                  className={classes.portrait}
                  alt={medium.name}
                  src={portrait}
                />}
            </Grid>
            <Grid item md={1}>
              <Box className={classes.buttons}>
                {nextAction}
              </Box>
            </Grid>
          </Grid>
        </Hidden>
        <Hidden mdUp>
          {portrait &&
            <img
              className={classes.portrait}
              alt={medium.name}
              src={portrait}
            />}
          <Box className={classes.buttons}>
            {prevAction}
            {nextAction}
          </Box>
        </Hidden>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
      >
        <div className={classes.scrollingItem}>
          <Card variant="outlined" square>
            {medium.owner.objectType.split('.')[1] !== 'people' && <CardHeaderOwner node={medium} />}
            <CardHeader
              avatar={
                <ActorAvatar
                  actor={author}
                  linked={Boolean(author.id)}
                />
              }
              title={
                <ActorTitle
                  actor={author}
                  linked={Boolean(author.id)}
                />
              }
              subheader={
                <Link
                  href={url}
                >
                  {moment(medium.creationTime).fromNow()}
                </Link>
              }
              action={menu}
            />
            {editing && form}
            {!editing &&
              <>
                {medium.body && <Player text={medium.body} />}
                <CardContent component="article">
                  {medium.name &&
                    <Typography
                      variant="h2"
                      className={classes.title}
                    >
                      {medium.name}
                    </Typography>}
                  {medium.body &&
                    <EntityBody>
                      {contentfilter({
                        text: medium.body,
                        filters: [
                          'hashtag',
                          'mention',
                          'url',
                        ],
                      })}
                    </EntityBody>}
                  {stats &&
                    <CardActions>
                      {stats}
                    </CardActions>}
                  {actions &&
                    <CardActions>
                      {actions}
                    </CardActions>}
                </CardContent>
              </>}
          </Card>
          <Tabs
            value={tab}
            onChange={changeTab}
            centered
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Comments" value={TABS.COMMENTS} />
            <Tab label="Locations" value={TABS.LOCATIONS} />
          </Tabs>
          {tab === TABS.COMMENTS && comments}
          {tab === TABS.LOCATIONS && locations}
        </div>
      </Grid>
    </Grid>
  );
};

MediumStepperDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  stats: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  locations: PropTypes.node,
  comments: PropTypes.node,
  form: PropTypes.node,
  editing: PropTypes.bool,
  nextAction: PropTypes.node,
  prevAction: PropTypes.node,
};

MediumStepperDefault.defaultProps = {
  actions: null,
  menu: null,
  stats: null,
  locations: null,
  comments: null,
  form: null,
  editing: false,
  nextAction: null,
  prevAction: null,
};

export default withStyles(styles)(MediumStepperDefault);
